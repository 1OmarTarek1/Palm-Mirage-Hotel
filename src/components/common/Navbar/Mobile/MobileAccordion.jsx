import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileAccordion({ 
  label, 
  icon, 
  href, 
  isExpanded, 
  onToggle, 
  onClose,
  hasSubItems,
  children 
}) {
  const content = (
    <>
      <div className="shrink-0">{icon}</div>
      <span className="font-semibold">{label}</span>
    </>
  );

  const containerClass = ({ isActive = false } = {}) => `
    flex-1 flex items-center gap-4 p-4 rounded-2xl transition-all
    ${isActive ? "bg-primary/20 text-primary shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}
  `;

  return (
    <div className="relative">
      <div className="flex items-center">
        {href ? (
          <NavLink to={href} onClick={onClose} className={containerClass}>
            {content}
          </NavLink>
        ) : (
          <button onClick={onToggle} className={`${containerClass()} flex-1 text-left`}>
            {content}
          </button>
        )}

        {hasSubItems && (
          <button
            onClick={onToggle}
            className={`
              absolute right-2 p-3 rounded-xl transition-all
              ${isExpanded ? "bg-white/20 text-white rotate-180" : "text-white/40 hover:text-white hover:bg-white/10"}
            `}
          >
            <ChevronDown size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-12 space-y-1 pb-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
