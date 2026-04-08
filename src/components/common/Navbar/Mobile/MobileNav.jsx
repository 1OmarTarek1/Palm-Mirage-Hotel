import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import LanguageToggle from "../LanguageToggle";
import MobileAccordion from "./MobileAccordion";

export default function MobileNav({ navLinks, isOpen, onClose, containerRef }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [expandedLink, setExpandedLink] = useState(null);

  const toggleExpand = (label) => {
    setExpandedLink(expandedLink === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="md:hidden absolute left-2 right-2 sm:left-3 sm:right-3 mt-2 overflow-hidden z-[70]"
        >
          <div className="p-4 sm:p-5 bg-primary/20 backdrop-blur-xl backdrop-brightness-50 border border-white/20 rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto no-scrollbar">
            <ul className="grid grid-cols-1 gap-2.5">
              {navLinks.map((link, idx) => {
                const hasSubLinks = link.dropdown || link.megaMenu;
                const subLinks = link.dropdown || (link.megaMenu && link.megaMenu.links) || [];

                return (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <MobileAccordion
                      label={link.label}
                      icon={link.icon}
                      href={link.href}
                      isExpanded={expandedLink === link.label}
                      onToggle={() => toggleExpand(link.label)}
                      onClose={onClose}
                      hasSubItems={hasSubLinks}
                    >
                      {subLinks.map((subLink) => (
                        <NavLink
                          key={subLink.label}
                          to={subLink.href}
                          onClick={onClose}
                          className={({ isActive }) => `
                            block py-2.5 px-3 rounded-lg text-xs transition-all
                            ${isActive ? "text-primary font-bold bg-primary/20" : "text-white/60 hover:text-white hover:bg-white/5"}
                          `}
                        >
                          {subLink.label}
                        </NavLink>
                      ))}
                    </MobileAccordion>
                  </motion.li>
                );
              })}

            </ul>

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/10 space-y-1"
              >
                <LanguageToggle 
                  mobile 
                  isExpanded={expandedLink === "language"}
                  onToggle={() => toggleExpand("language")}
                  onClose={onClose}
                />
                
                <ThemeToggle mobile />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
