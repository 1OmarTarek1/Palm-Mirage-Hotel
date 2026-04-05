import { memo } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import NavTooltip from "./NavTooltip";

function Logo({ mobileIconOnly = false }) {
  if (mobileIconOnly) {
    return (
      <NavTooltip label="Palm Mirage">
        <NavLink
          to="/"
          className="flex items-center justify-center focus:outline-none"
          aria-label="Palm Mirage"
          title="Palm Mirage"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-10 h-10 flex items-center justify-center cursor-pointer shrink-0"
          >
            <img src={logoImg} alt="" className="w-full h-full object-contain" />
          </motion.div>
        </NavLink>
      </NavTooltip>
    );
  }

  return (
    <NavLink to="/" className="flex items-center gap-2 group focus:outline-none">
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center cursor-pointer shrink-0"
          >
            <img src={logoImg} alt="Palm Mirage Logo" className="w-full h-full object-contain" />
          </motion.div>

          <div className="flex flex-col">
            <span
              className={`
              text-lg md:text-xl font-header tracking-tight font-bold leading-none transition-colors duration-300
              ${isActive ? "text-primary" : "text-primary group-hover:text-primary"}
            `}
            >
              Palm Mirage
            </span>
            <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-medium text-white/60 leading-none mt-1">
              Luxury Hotel
            </span>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default memo(Logo);
