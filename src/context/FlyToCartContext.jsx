import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FlyToCartContext = createContext(null);

export function FlyToCartProvider({ children }) {
  const [animations, setAnimations] = useState([]);
  const counters = useRef(0);

  const flyToCart = useCallback((sourceElement) => {
    // 1. Get source position
    const sourceRect = sourceElement.getBoundingClientRect();
    
    // 2. Find target (Navbar cart button)
    // We search for all instances because desktop and mobile might have separate buttons with the same ID
    const targetElements = document.querySelectorAll("#navbar-cart-button");
    const targetElement = Array.from(targetElements).find(
      (el) => el.offsetWidth > 0 && el.offsetHeight > 0
    );

    if (!targetElement) {
      console.warn("FlyToCart: visible navbar-cart-button not found");
      return;
    }
    const targetRect = targetElement.getBoundingClientRect();

    // 3. Create animation object
    const id = counters.current++;
    const newAnimation = {
      id,
      startX: sourceRect.left + sourceRect.width / 2,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: targetRect.left + targetRect.width / 2,
      endY: targetRect.top + targetRect.height / 2,
    };

    setAnimations((prev) => [...prev, newAnimation]);

    // 4. Remove after completion (matching transition duration)
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== id));
    }, 1000);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ flyToCart }}>
      {children}
      
      {/* Overlay for animations */}
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
              {/* Optional inner glow/pulse */}
              <div className="w-full h-full bg-white/20 animate-pulse rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error("useFlyToCart must be used within a FlyToCartProvider");
  }
  return context;
}
