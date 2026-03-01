import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_PATHS } from "../navLinks";
import ThemeToggle from "../ThemeToggle";
import LanguageToggle from "../LanguageToggle";
import MobileAccordion from "./MobileAccordion";

export default function MobileNav({ navLinks, isOpen, onClose }) {
  const [expandedLink, setExpandedLink] = useState(null);

  const toggleExpand = (label) => {
    setExpandedLink(expandedLink === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="md:hidden absolute left-5 right-5 mt-4 overflow-hidden z-40"
        >
          <div className="p-6 bg-primary/20 backdrop-blur-xl backdrop-brightness-50 border border-white/20 rounded-3xl shadow-2xl max-h-[70vh] overflow-y-auto no-scrollbar">
            <ul className="grid grid-cols-1 gap-3">
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
                            block p-3 rounded-xl text-sm transition-all
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-6 border-t border-white/10 space-y-1"
            >
              <LanguageToggle 
                mobile 
                isExpanded={expandedLink === "language"}
                onToggle={() => toggleExpand("language")}
                onClose={onClose}
              />
              
              <ThemeToggle mobile />

              <NavLink
                to={AUTH_PATHS.login}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-4 p-4 rounded-2xl transition-all
                  ${isActive ? "bg-primary/20 text-primary shadow-lg" : "text-white/60 hover:bg-white/10 hover:text-white"}
                `}
              >
                <div className="shrink-0">
                  <LogIn size={20} />
                </div>
                <span className="font-semibold">Login</span>
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
