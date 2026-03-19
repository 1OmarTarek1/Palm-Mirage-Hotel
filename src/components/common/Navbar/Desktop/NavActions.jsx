import { memo } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import LanguageToggle from "../LanguageToggle";
import LoginButton from "../LoginButton";
import CartButton from "../CartButton";

const actionVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

function NavActions({ activeMenu, onHover, onLeave }) {
  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-3">
      <motion.div variants={actionVariants}><CartButton /></motion.div>
      <motion.div variants={actionVariants}>
        <LanguageToggle 
          activeMenu={activeMenu}
          onHover={onHover}
          onLeave={onLeave}
        />
      </motion.div>
      <motion.div variants={actionVariants}><ThemeToggle /></motion.div>
      <motion.div variants={actionVariants}><LoginButton /></motion.div>
    </div>
  );
}

export default memo(NavActions);
