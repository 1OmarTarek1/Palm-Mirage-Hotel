import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnimatedScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track continuous scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();
  
  // Create a spring animation for the progress ring so it feels smooth
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.5,
        pointerEvents: isVisible ? "auto" : "none"
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center",
        "w-12 h-12 rounded-full transition-colors group",
        "bg-transparent text-primary overflow-hidden cursor-pointer",
        "hover:bg-primary/5" // Slight hover effect
      )}
    >
      {/* Background SVG Circle */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          className="stroke-primary/20"
          strokeWidth="3"
        />
        {/* Animated Progress Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      {/* Bouncing Chevron Arrow inside */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <ChevronUp size={24} className="relative z-10 text-primary" />
      </motion.div>
    </motion.button>
  );
}
