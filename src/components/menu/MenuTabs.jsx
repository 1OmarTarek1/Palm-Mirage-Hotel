import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

export default function MenuTabs({ categories, activeIndex, onSelect }) {
  
  // Helper to render icon correctly whether it's a URL or a Lucide string
  const renderIcon = (iconSrc, isActive, label) => {
    if (!iconSrc) {
      return <LucideIcons.UtensilsCrossed size={20} strokeWidth={2.5} className={isActive ? "text-white" : "text-muted-foreground"} />;
    }
    
    // If it's a full URL path from cloudinary etc
    if (typeof iconSrc === 'string' && (iconSrc.startsWith('http') || iconSrc.startsWith('data:'))) {
      return (
        <img 
          src={iconSrc} 
          alt={label} 
          className={`w-6 h-6 object-contain transition-all ${!isActive ? 'opacity-60 grayscale' : 'opacity-100'}`} 
          loading="lazy"
        />
      );
    }
    
    // Default: it's a string name of a Lucide icon (e.g. "Cake", "Utensils")
    const IconComponent = LucideIcons[iconSrc] || LucideIcons.UtensilsCrossed;
    return <IconComponent size={20} strokeWidth={2.5} className={isActive ? "text-white" : "text-muted-foreground"} />;
  };

  return (
    <motion.div
      className="mt-2 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-stretch border border-border rounded-2xl overflow-x-auto overflow-y-hidden divide-x divide-border shadow-sm scrollbar-hide webkit-scrollbar-hide">
        {categories.map((category, i) => {
          const isActive = i === activeIndex;
          const label = category.label;
          const iconSrc = category.icon; // e.g. "Utensils" or "http..."

          return (
            <button
              key={label}
              onClick={() => onSelect(i)}
              className={`relative min-w-[120px] flex items-center gap-2 md:gap-3 px-3 md:px-6 py-4 flex-1 justify-center md:justify-start transition-colors duration-200 cursor-pointer ${
                isActive ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              <span
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 overflow-hidden ${
                  isActive
                    ? "bg-secondary ring-2 ring-primary shadow-md"
                    : "bg-muted"
                }`}
              >
                {renderIcon(iconSrc, isActive, label)}
              </span>
              <span
                className={`hidden sm:block text-sm md:text-base font-medium transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
