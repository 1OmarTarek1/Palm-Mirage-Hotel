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
              x: anim.startX - 16,
              y: anim.startY - 16,
              scale: 0.25,
              opacity: 0,
            }}
            animate={{
              x: anim.endX - 16,
              y: anim.endY - 16,
              scale: [0.25, 1.15, 0.45],
              opacity: [0, 1, 1, 0.45],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.45, 0, 0.55, 1],
            }}
            className="absolute top-0 left-0 h-8 w-8 overflow-hidden rounded-full border-2 border-white/40 bg-secondary shadow-[0_0_18px_rgba(198,169,105,0.55)]"
          >
            {anim.imageUrl ? (
              <img
                src={anim.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-full bg-white/25" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyToCartOverlay;
