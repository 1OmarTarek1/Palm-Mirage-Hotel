import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function MenuHeader() {
  return (
    <div className="pt-20 pb-6 text-center">
      <motion.div
        className="flex items-center justify-center gap-3 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="h-px w-12 bg-primary/50" />
        <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
          Our Menu
        </span>
        <div className="h-px w-12 bg-primary/50" />
      </motion.div>

      <motion.h1
        className="text-5xl md:text-6xl font-bold text-foreground tracking-tight font-header"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
      >
        Menu
      </motion.h1>

      <motion.div
        className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
        <ChevronRight size={14} />
        <span className="text-foreground">Menu</span>
      </motion.div>
    </div>
  );
}
