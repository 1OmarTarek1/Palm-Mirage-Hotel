import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const NOTIFICATIONS_QUERY_KEY = ["notifications", "inbox"];

function applyReadPatchToInboxCache(old, id, updated) {
  if (!old?.notifications || !updated?.id) return old;
  const prev = old.notifications.find((n) => n.id === id);
  const wasUnread = Boolean(prev && !prev.readAt);
  return {
    ...old,
    notifications: old.notifications.map((n) => (n.id === id ? { ...n, ...updated } : n)),
    unreadCount: wasUnread ? Math.max(0, (old.unreadCount ?? 0) - 1) : (old.unreadCount ?? 0),
  };
}

function markAllReadInInboxCache(old) {
  if (!old?.notifications) return old;
  const now = new Date().toISOString();
  return {
    ...old,
    notifications: old.notifications.map((n) => (n.readAt ? n : { ...n, readAt: now })),
    unreadCount: 0,
  };
}

function formatRelativeTime(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return d.toLocaleDateString();
}

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMdUp;
}

export default function NotificationButton() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [panelOpen, setPanelOpen] = useState(false);
  const timeoutRef = useRef(null);
  const isMdUp = useIsMdUp();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await axiosPrivate.get("/notifications", { params: { limit: 30 } });
      return res.data?.data ?? { notifications: [], unreadCount: 0 };
    },
    staleTime: 30_000,
  });

  const notifications = data?.notifications ?? [];
  const notificationCount = data?.unreadCount ?? 0;

  const openPanel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPanelOpen(true);
    void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
  }, [queryClient]);

  const scheduleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPanelOpen(false), 180);
  }, []);

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const closePanel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPanelOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen((p) => {
      const next = !p;
      if (next) void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      return next;
    });
  }, [queryClient]);

  const markRead = useCallback(
    async (id) => {
      try {
        const res = await axiosPrivate.patch(`/notifications/${id}/read`);
        const updated = res.data?.data?.notification;
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) =>
          applyReadPatchToInboxCache(old, id, updated),
        );
        await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      } catch (e) {
        console.error("Failed to mark notification read:", e);
      }
    },
    [axiosPrivate, queryClient],
  );

  const markAllRead = useCallback(async () => {
    try {
      await axiosPrivate.post("/notifications/read-all");
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) => markAllReadInInboxCache(old));
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
  }, [axiosPrivate, queryClient]);

  useBodyScrollLock(panelOpen && !isMdUp);

  const listBusy = isLoading || isFetching;

  const mobilePanel =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {panelOpen && !isMdUp ? (
              <motion.div
                key="notification-mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] flex flex-col bg-black/50 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label="Notifications"
                onClick={closePanel}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card pt-[env(safe-area-inset-top,0px)] shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-border/30 px-4 py-3">
                    <p className="text-base font-semibold text-foreground">Notifications</p>
                    <div className="flex items-center gap-2">
                      {notificationCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => void markAllRead()}
                          className="cursor-pointer text-xs font-medium text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={closePanel}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                    <NotificationListBody
                      notifications={notifications}
                      busy={listBusy}
                      onMarkRead={markRead}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="relative"
        onMouseEnter={isMdUp ? openPanel : undefined}
        onMouseLeave={isMdUp ? scheduleClose : undefined}
      >
        <motion.button
          type="button"
          aria-label={
            notificationCount > 0 ? `Notifications, ${notificationCount} unread` : "Notifications"
          }
          aria-expanded={panelOpen}
          aria-haspopup="true"
          onClick={togglePanel}
          className={`
          relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:bg-primary/20 md:h-11 md:w-11
          ${
            panelOpen
              ? "border border-primary/20 bg-primary/20 text-primary shadow-inner"
              : "border border-white/10 bg-primary/5 text-white/60"
          }
        `}
        >
          <Bell className="h-[18px] w-[18px] md:h-5 md:w-5" />

          <AnimatePresence>
            {notificationCount > 0 && (
              <motion.span
                key="notification-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="pointer-events-none absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-md md:h-[18px] md:min-w-[18px] md:text-[10px]"
                aria-hidden
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {panelOpen && isMdUp ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute right-0 top-full z-[60] mt-3 hidden w-[min(100vw-2rem,20rem)] max-h-[min(70vh,22rem)] overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-2xl md:block"
              role="region"
              aria-label="Notification list"
            >
              <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                {notificationCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => void markAllRead()}
                    className="cursor-pointer text-[11px] font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                ) : null}
              </div>
              <div className="max-h-[min(60vh,18rem)] overflow-y-auto">
                <NotificationListBody
                  notifications={notifications}
                  busy={listBusy}
                  onMarkRead={markRead}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {mobilePanel}
    </>
  );
}

function NotificationListBody({ notifications, busy, onMarkRead }) {
  if (busy && notifications.length === 0) {
    return <p className="p-4 text-center text-sm text-muted-foreground">Loading…</p>;
  }

  if (notifications.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
    );
  }

  return (
    <ul className="space-y-1 p-2 md:max-h-[min(60vh,18rem)] md:overflow-y-auto">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/10 ${
            n.readAt ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-foreground">{n.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.message}</p>
              <p className="mt-1 text-[10px] text-muted-foreground/80">
                {formatRelativeTime(n.createdAt)}
                {n.readAt ? " · Read" : ""}
              </p>
            </div>
            {!n.readAt ? (
              <button
                type="button"
                onClick={() => void onMarkRead(n.id)}
                className="shrink-0 cursor-pointer text-[10px] font-medium uppercase tracking-wide text-primary hover:underline"
              >
                Mark read
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
