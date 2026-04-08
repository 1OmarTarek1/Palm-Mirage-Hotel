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
      <div className="shrink-0 [&_svg]:size-[15px]">{icon}</div>
      <span className="font-semibold text-sm leading-tight">{label}</span>
    </>
  );

  const containerClass = ({ isActive = false } = {}) => `
    flex-1 flex items-center gap-3 min-h-0 py-3 px-3 rounded-xl transition-all cursor-pointer
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
              absolute right-1 p-1.5 rounded-lg transition-all cursor-pointer
              ${isExpanded ? "bg-white/20 text-white rotate-180" : "text-white/40 hover:text-white hover:bg-white/10"}
            `}
          >
            <ChevronDown size={15} strokeWidth={2.25} />
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
            <div className="mt-1 ml-8 space-y-1 pb-1.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
