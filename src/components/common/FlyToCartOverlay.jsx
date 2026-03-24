import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { selectAnimations } from "../../store/slices/uiSlice";

const FlyToCartOverlay = () => {
  const animations = useSelector(selectAnimations);

  return (
    <div className="fixed inset-0 pointer-events-none z-99999 overflow-hidden">
      <AnimatePresence>
        {animations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{ 
              x: anim.startX - 12, 
              y: anim.startY - 12, 
              scale: 0.2, 
              opacity: 0 
            }}
            animate={{
              x: anim.endX - 12,
              y: anim.endY - 12,
              scale: [0.2, 1.2, 0.4],
              opacity: [0, 1, 1, 0.5],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.45, 0, 0.55, 1],
            }}
            className="absolute top-0 left-0 w-6 h-6 bg-secondary rounded-full shadow-[0_0_15px_rgba(184,149,85,0.6)] border-2 border-white/30 flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full bg-white/20 animate-pulse rounded-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyToCartOverlay;
