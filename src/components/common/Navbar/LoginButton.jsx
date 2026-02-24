import { LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import NavTooltip from "./NavTooltip";

export default function LoginButton() {
  return (
    <NavTooltip label="Login">
      <NavLink
        to="/auth/login"
        className={({ isActive }) => `
          flex items-center justify-center w-10 h-10 rounded-full border border-[#fefefe11]
          transition-all duration-300 hover:bg-primary/20
          ${isActive ? "text-primary bg-primary/20 shadow-inner" : "text-[#fefefea9] bg-primary/5"}
        `}
      >
        <motion.div>
          <LogIn size={18} />
        </motion.div>
      </NavLink>
    </NavTooltip>
  );
}
