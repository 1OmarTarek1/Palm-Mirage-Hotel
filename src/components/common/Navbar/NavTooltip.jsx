import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavTooltip({ label, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 mt-3 z-50 pointer-events-none"
          >
            <div className="px-4 py-1.5 bg-primary/90 border border-white/10 rounded-xl shadow-2xl whitespace-nowrap text-sm font-medium text-white tracking-wide">
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
