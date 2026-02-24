import { useState } from "react";
import { Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavTooltip from "./NavTooltip";
import MobileAccordion from "./Mobile/MobileAccordion";
import NavDropdown from "./Desktop/NavDropdown";

export default function LanguageToggle({ 
  mobile = false, 
  isExpanded, 
  onToggle, 
  onClose,
  activeMenu,
  onHover,
  onLeave
}) {
  const [currentLang, setCurrentLang] = useState("EN");
  const icon = <Languages size={18} />;

  const languages = [
    { code: "EN", label: "English", href: "#" },
    { code: "AR", label: "العربية", href: "#" },
    { code: "FR", label: "Français", href: "#" },
  ];

  // Helper for desktop handlers
  const langLink = { label: "Language" };

  if (mobile) {
    return (
      <MobileAccordion
        label={`Language: ${currentLang}`}
        icon={icon}
        isExpanded={isExpanded}
        onToggle={onToggle}
        hasSubItems={true}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setCurrentLang(lang.code);
              onClose?.();
            }}
            className={`
              w-full text-left p-3 rounded-xl text-sm transition-all
              ${currentLang === lang.code ? "text-white font-bold bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"}
            `}
          >
            {lang.label}
          </button>
        ))}
      </MobileAccordion>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => onHover(langLink)}
      onMouseLeave={onLeave}
    >
      <NavTooltip label="Language">
        <motion.button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/5 hover:bg-primary/20 transition-all text-[#fefefea9] border border-[#fefefe11] cursor-pointer"
          aria-label="Toggle Language"
        >
          {icon}
        </motion.button>
      </NavTooltip>

      <AnimatePresence>
        {activeMenu?.label === langLink.label && (
          <NavDropdown 
            links={languages.map(l => ({ 
              ...l, 
              isActive: currentLang === l.code,
              onClick: () => {
                setCurrentLang(l.code);
                onLeave();
              }
            }))} 
            isOpen={true}
            isRouterLink={false}
            onMouseEnter={() => onHover(langLink)}
            onMouseLeave={onLeave}
            onItemClick={() => onLeave()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
