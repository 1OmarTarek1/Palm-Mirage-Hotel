import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function NavDropdown({ links, isOpen, onMouseEnter, onMouseLeave, onItemClick, isRouterLink = true }) {
  if (!links) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        absolute top-full transform -translate-x-1/2 left-1/2 mt-4 w-56
        bg-card/90 backdrop-blur-2xl
        border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[60]
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      <div className="p-2 space-y-1">
        {links.map((link) =>
          isRouterLink ? (
            // Normal nav links — use NavLink for router-based active styling
            <NavLink
              key={link.label}
              to={link.href || "#"}
              onClick={(e) => {
                if (link.onClick) { e.preventDefault(); link.onClick(); }
                onItemClick();
              }}
              className={({ isActive }) => `
                block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer
                ${isActive
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/10"}
              `}
            >
              {link.label}
            </NavLink>
          ) : (
            // Non-router items (e.g. language selector) — use button with manual isActive
            <button
              key={link.label}
              onClick={() => { link.onClick?.(); onItemClick(); }}
              className={`
                w-full text-left block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                ${link.isActive
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/10"}
              `}
            >
              {link.label}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}

