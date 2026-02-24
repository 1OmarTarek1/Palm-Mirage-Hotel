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

export default function ThemeToggle({ mobile = false }) {
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
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </AnimatePresence>
  );

  if (mobile) {
    return (
      <button
        onClick={() => dispatch(toggleTheme())}
        className="flex items-center gap-4 p-4 rounded-2xl w-full text-white/80 hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
      >
        <div className="shrink-0">{icon}</div>
        <span className="font-semibold">{isDark ? "Light Mode" : "Dark Mode"}</span>
      </button>
    );
  }

  return (
    <NavTooltip label={isDark ? "Light Mode" : "Dark Mode"}>
      <motion.button
        onClick={() => dispatch(toggleTheme())}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/5 hover:bg-primary/20 transition-all text-[#fefefea9] border border-[#fefefe11] cursor-pointer overflow-hidden"
        aria-label="Toggle Theme"
      >
        {icon}
      </motion.button>
    </NavTooltip>
  );
}
