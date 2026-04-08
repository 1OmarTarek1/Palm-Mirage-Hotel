import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";

const MotionDiv = motion.div;

/** Shared shell: viewport height on mobile, centered on sm+. */
export const APP_MODAL_SHELL =
  "fixed inset-0 flex flex-col max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:overflow-hidden max-sm:pt-[env(safe-area-inset-top,0px)] sm:items-center sm:justify-center sm:p-4 sm:pt-0";

const DEFAULT_TINT = "bg-black/45 p-0 backdrop-blur-sm";

const PANEL_SPRING = { type: "spring", stiffness: 220, damping: 24 };

/**
 * Site-wide modal: locks body scroll, optional portal to `document.body`.
 *
 * @param {'account'|'card'|'plain'} layout
 * - `account` — title/subtitle or custom `header`, scrollable `children`, optional `footer`
 * - `card` — one framed panel; `children` = full inner UI
 * - `plain` — `children` fill the shell (e.g. split backdrop + panel); use `stopPropagation` on panel
 */
export default function AppModal({
  open,
  onClose,
  layout = "account",
  lockScroll = true,
  portal = true,
  zIndex = 120,
  closeOnBackdrop = true,
  showTint = true,
  tintClassName = DEFAULT_TINT,
  outerClassName,
  panelClassName,
  contentClassName,
  title,
  subtitle,
  header,
  footer,
  tone = "default",
  maxWidthClassName = "sm:max-w-2xl",
  maxHeightClassName = "sm:max-h-[min(90dvh,56rem)]",
  hideCloseButton = false,
  children,
}) {
  useBodyScrollLock(Boolean(lockScroll && open));

  const toneBorder =
    tone === "danger" ? "border-red-500/20" : "border-border/60";

  const accountPanelBase =
    "flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-none border bg-background/95 shadow-2xl max-sm:max-h-full sm:h-auto sm:flex-none sm:rounded-[2rem]";

  const node = (
    <AnimatePresence>
      {open ? (
        <MotionDiv
          key="app-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(APP_MODAL_SHELL, showTint && tintClassName, outerClassName)}
          style={{ zIndex }}
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          {layout === "plain" && children}

          {layout === "card" && (
            <MotionDiv
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={PANEL_SPRING}
              className={cn(
                "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
                maxWidthClassName,
                maxHeightClassName,
                panelClassName,
              )}
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </MotionDiv>
          )}

          {layout === "account" && (
            <MotionDiv
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={PANEL_SPRING}
              className={cn(
                accountPanelBase,
                toneBorder,
                maxWidthClassName,
                maxHeightClassName,
                panelClassName,
              )}
              onClick={(event) => event.stopPropagation()}
            >
              {header ? (
                <div className="mb-5 shrink-0 border-b border-border/40 px-6 pt-6 pb-4 sm:border-0 sm:pb-4">{header}</div>
              ) : (
                <div className="mb-5 flex shrink-0 items-start justify-between gap-4 border-b border-border/40 px-6 pt-6 pb-4 sm:border-0 sm:pb-4">
                  <div className="min-w-0 pr-2">
                    {title ? <h3 className="text-2xl font-bold text-foreground">{title}</h3> : null}
                    {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
                  </div>
                  {!hideCloseButton ? (
                    <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose}>
                      <X size={18} />
                    </Button>
                  ) : null}
                </div>
              )}

              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]",
                  contentClassName,
                )}
              >
                {children}
              </div>

              {footer ? (
                <div className="shrink-0 border-t border-border/30 bg-background/95 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:border-0 sm:bg-transparent sm:px-6 sm:pb-6 sm:pt-0">
                  {footer}
                </div>
              ) : null}
            </MotionDiv>
          )}
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );

  if (portal && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }

  return node;
}
