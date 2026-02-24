import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 group focus:outline-none">
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ rotate: 5 }}
            className={`
              w-10 h-10 rounded-full transition-all duration-500
              flex items-center justify-center cursor-pointer overflow-hidden
              border
              ${isActive
                ? "bg-primary text-white border-primary rotate-0"
                : "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20 group-hover:border-primary/30"}
            `}
          >
            {/* Custom Palm Tree SVG */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6"
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8c0 1.63 1 3.06 2.5 4" />
              <path d="M11 8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.1-.45 2.1-1.17 2.83C17.29 11.38 16.5 12.5 16.5 14" />
              <path d="M12 13v8" />
              <path d="M8 16c1.5 0 3-1 3-3" />
              <path d="M16 16c-1.5 0-3-1-3-3" />
            </svg>
          </motion.div>
          
          <div className="flex flex-col">
            <span className={`
              text-lg font-header tracking-tight font-bold leading-none transition-colors duration-300
              ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}
            `}>
              Palm Mirage
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground/60 leading-none mt-1">
              Luxury Hotel
            </span>
          </div>
        </>
      )}
    </NavLink>
  );
}

