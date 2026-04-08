import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, selectIsDark } from "@/store/slices/themeSlice";
import NavTooltip from "./NavTooltip";

const iconVariants = {
  initial: { y: 12, opacity: 0, scale: 0.7 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { y: -12, opacity: 0, scale: 0.7, transition: { duration: 0.2, ease: "easeIn" } },
};

const menuEase = [0.22, 1, 0.36, 1];

const pillSpring = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.65,
};

const menuTextMotion = {
  initial: { opacity: 0, y: 5, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: menuEase },
  },
  exit: {
    opacity: 0,
    y: -5,
    filter: "blur(3px)",
    transition: { duration: 0.2, ease: menuEase },
  },
};

export default function ThemeToggle({ mobile = false, menuCard = false }) {
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();

  const icon = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isDark ? "sun" : "moon"}
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ display: "flex" }}
      >
        {isDark ? <Sun size={mobile ? 15 : 20} /> : <Moon size={mobile ? 15 : 20} />}
      </motion.span>
    </AnimatePresence>
  );

  if (mobile && menuCard) {
    const modeLabel = isDark ? "Dark mode" : "Light mode";

    return (
      <motion.div
        layout={false}
        className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/80 transition-[background-color] duration-300 ease-out hover:bg-primary/10"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative flex h-4 w-4 shrink-0 items-center justify-center text-foreground/70">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "moon-led" : "sun-led"}
                initial={{ opacity: 0, scale: 0.88, filter: "blur(3px)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.26, ease: menuEase },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.88,
                  filter: "blur(3px)",
                  transition: { duration: 0.18, ease: menuEase },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                {isDark ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="relative min-h-[1.35em] min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={modeLabel}
                variants={menuTextMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="block truncate"
              >
                {modeLabel}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => dispatch(toggleTheme())}
          className="relative h-7 w-[3.35rem] shrink-0 cursor-pointer rounded-full border border-border/40 bg-muted/35 shadow-inner transition-[box-shadow,background-color] duration-300 ease-out hover:bg-muted/45"
        >
          <Moon
            size={12}
            strokeWidth={2.25}
            className={`pointer-events-none absolute left-1 top-1/2 z-[1] -translate-y-1/2 transition-[color,opacity] duration-300 ease-out ${
              isDark ? "text-primary" : "text-muted-foreground/45"
            }`}
            aria-hidden
          />
          <Sun
            size={12}
            strokeWidth={2.25}
            className={`pointer-events-none absolute right-1 top-1/2 z-[1] -translate-y-1/2 transition-[color,opacity] duration-300 ease-out ${
              !isDark ? "text-primary" : "text-muted-foreground/45"
            }`}
            aria-hidden
          />
          <motion.span
            className="pointer-events-none absolute top-1/2 z-[2] size-[1.125rem] -translate-y-1/2 rounded-full border border-border/50 bg-background shadow-md"
            initial={false}
            animate={{
              left: isDark ? "3px" : "calc(100% - 1.125rem - 3px)",
            }}
            transition={pillSpring}
          />
        </button>
      </motion.div>
    );
  }

  if (mobile) {
    return (
      <button
        type="button"
        onClick={() => dispatch(toggleTheme())}
        className="flex items-center gap-3 rounded-xl text-sm transition-all cursor-pointer overflow-hidden text-white/80 hover:bg-white/10 w-full py-3 px-3"
      >
        <div className="shrink-0 [&_svg]:size-[15px]">{icon}</div>
        <span className="leading-tight font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    );
  }

  return (
    <NavTooltip label={isDark ? "Light Mode" : "Dark Mode"}>
      <motion.button
        onClick={() => dispatch(toggleTheme())}
        className="w-11 h-11 flex items-center justify-center rounded-full bg-primary/5 hover:bg-primary/20 transition-all text-white/60 border border-white/10 cursor-pointer overflow-hidden focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        aria-label="Toggle Theme"
      >
        {icon}
      </motion.button>
    </NavTooltip>
  );
}
