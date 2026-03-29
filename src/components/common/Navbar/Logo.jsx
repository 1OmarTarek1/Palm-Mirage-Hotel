import { memo } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logoImg from "@/assets/logo.png";

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 group focus:outline-none">
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center cursor-pointer shrink-0"
          >
            <img src={logoImg} alt="Palm Mirage Logo" className="w-full h-full object-contain" />
          </motion.div>
          
          <div className="flex flex-col">
            <span className={`
              text-base md:text-lg font-header tracking-tight font-bold leading-none transition-colors duration-300
              ${isActive ? "text-primary" : "text-primary group-hover:text-primary"}
            `}>
              Palm Mirage
            </span>
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-white/60 leading-none mt-1">
              Luxury Hotel
            </span>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default memo(Logo);
