import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Mobile overlay drawer. Pass `fullScreen` for a full-viewport sheet (e.g. Rooms). */
export default function MobileDrawer({ isOpen, onClose, title, subtitle, fullScreen = false, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fullScreen ? 0.2 : 0.25 }}
            onClick={onClose}
            className={cn(
              "fixed inset-0 z-60 bg-black/50 backdrop-blur-sm lg:hidden",
              fullScreen && "bg-black/65 backdrop-blur-md",
            )}
          />

          {fullScreen ? (
            <motion.div
              key="drawer-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-drawer-title"
              initial={{ opacity: 0, y: "12%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "8%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-muted/35 lg:hidden dark:bg-background/80"
              style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <header className="flex shrink-0 items-start justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Rooms</p>
                  <h2
                    id="mobile-drawer-title"
                    className="mt-1 font-header text-xl font-bold leading-tight text-foreground sm:text-2xl"
                  >
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{subtitle}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/65 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <X size={20} strokeWidth={2.25} />
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-0 sm:px-5">
                {children}
              </div>
            </motion.div>
          ) : (
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-[70] flex h-full w-[85%] max-w-[320px] flex-col overflow-y-auto border-l border-border bg-card shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-header text-lg font-bold text-foreground">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 transition-colors hover:bg-primary/10"
                >
                  <X size={20} className="text-foreground/60" />
                </button>
              </div>

              <div className="flex-1 p-6">{children}</div>
            </motion.aside>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
