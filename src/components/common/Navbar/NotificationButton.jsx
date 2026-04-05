import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Booking confirmed", body: "Your deluxe room is reserved for Apr 12–15.", time: "2h ago" },
  { id: "2", title: "Spa offer", body: "20% off treatments this weekend — limited slots.", time: "1d ago" },
  { id: "3", title: "Checkout reminder", body: "Tomorrow is your last day — extend from your profile.", time: "2d ago" },
];

const notificationCount = MOCK_NOTIFICATIONS.length;

function NotificationList() {
  return (
    <ul className="space-y-1 p-2 md:max-h-[min(60vh,18rem)] md:overflow-y-auto">
      {MOCK_NOTIFICATIONS.map((n) => (
        <li
          key={n.id}
          className="cursor-default rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/10"
        >
          <p className="text-sm font-medium leading-snug text-foreground">{n.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/80">{n.time}</p>
        </li>
      ))}
    </ul>
  );
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
  const [panelOpen, setPanelOpen] = useState(false);
  const timeoutRef = useRef(null);
  const isMdUp = useIsMdUp();

  const openPanel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPanelOpen(true);
  }, []);

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
    setPanelOpen((p) => !p);
  }, []);

  useBodyScrollLock(panelOpen && !isMdUp);

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
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Demo</span>
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
                    <NotificationList />
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
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Demo</span>
              </div>
              <NotificationList />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {mobilePanel}
    </>
  );
}
