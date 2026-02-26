import { motion } from "framer-motion";
import { categories } from "./menuData";

export default function MenuTabs({ activeIndex, onSelect }) {
  return (
    <motion.div
      className="mt-2 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-stretch bg-muted border border-border rounded-2xl overflow-hidden divide-x divide-border shadow-sm">
        {categories.map(({ label, Icon }, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={label}
              onClick={() => onSelect(i)}
              className={`relative flex items-center gap-2 md:gap-3 px-3 md:px-6 py-4 flex-1 justify-center md:justify-start transition-colors duration-200 cursor-pointer ${
                isActive ? "bg-background shadow-sm" : "hover:bg-background"
              }`}
            >
              <span
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-secondary text-white  ring-2 ring-primary shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
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
