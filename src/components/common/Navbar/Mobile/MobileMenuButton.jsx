import { motion } from "framer-motion";

export default function MobileMenuButton({ isOpen, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="md:hidden flex items-center justify-center w-10 h-10 text-white rounded-full bg-white/10 border border-white/10 relative"
      aria-label="Toggle menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
          <motion.path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 4 6 L 20 6" },
              open: { d: "M 6 18 L 18 6" }
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <motion.path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M 4 12 L 20 12"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.2 }}
          />
          <motion.path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 4 18 L 20 18" },
              open: { d: "M 6 6 L 18 18" }
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
        </svg>
      </div>
    </motion.button>
  );
}
