import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import BookingBar from "@/components/rooms/BookingBar";
import { Button } from "@/components/ui/button";


const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?fm=webp&w=1920&q=75&auto=format&fit=crop",
    title: "Royal Gastronomy",
    subtitle: "A culinary journey through the finest flavors of the Nile.",
    accent: "text-rose-200"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?fm=webp&w=1920&q=75&auto=format&fit=crop",
    title: "Sanctuary of Silence",
    subtitle: "Find your peace in our sanctuary overlooking the eternal Nile.",
    accent: "text-emerald-200"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?fm=webp&w=1920&q=75&auto=format&fit=crop",
    title: "The Heritage of Luxor",
    subtitle: "Step into a world where ancient majesty meets contemporary luxury.",
    accent: "text-amber-200"
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Optimized image preloading
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentIndex]);

  // Throttled parallax effect based on mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const smoothX = useSpring(mousePosition.x, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(mousePosition.y, { stiffness: 100, damping: 30 });

  return (
    <div 
      ref={containerRef}
      id="hero"
      className="relative w-screen left-1/2 -translate-x-1/2 h-screen  overflow-hidden bg-[#0a0a0a]"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Layer 1: Background Ken Burns Image */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ 
              duration: 8,
              ease: "linear"
            }}
            style={{ 
              willChange: "transform"
            }}
          >
            <div className="absolute inset-0">
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover transform-gpu"
                crossOrigin="anonymous"
              />
            </div>
            
            {/* Elegant Vignette Overlay (Top, Bottom, Left, Right) */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/20 z-10 pointer-events-none" />
            
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-10 pointer-events-none" />
          </motion.div>

          {/* Layer 2: Architectural "Arch" Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: "linear-gradient(45deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0) 100%)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          />

          {/* Layer 3: Content Container */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-header text-white mb-6 leading-[1.1] drop-shadow-2xl flex flex-wrap justify-center py-2"
              >
                {Array.from(slides[currentIndex].title).map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ 
                      delay: 0.5 + (i * 0.03), 
                      duration: 0.8, 
                      ease: "easeOut" 
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-base md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed mb-10"
              >
                {slides[currentIndex].subtitle}
              </motion.p>

              {/* Mobile Booking Trigger Button (Smaller & Integrated) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="lg:hidden mt-6 flex justify-center"
              >
                <Button 
                  variant="outline"
                  onClick={() => setShowMobileBooking(true)}
                  className="px-8 h-12 rounded-full text-[11px] font-bold tracking-widest uppercase"
                >
                  Check Availability
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators - Architectural Style (Vertical stack, safe positioning) */}
      <div className="absolute bottom-12 right-6 md:bottom-16 md:right-12 lg:right-12 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 flex flex-col gap-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative flex items-center justify-end w-32 pl-4 py-2 cursor-pointer"
          >
            <span className={`mr-4 text-xs lg:text-sm font-bold tracking-[0.2em] lg:tracking-widest uppercase transition-opacity duration-300 ${index === currentIndex ? "opacity-100 text-amber-200" : "opacity-0 group-hover:opacity-100 text-white/60"}`}>
              0{index + 1}
            </span>
            <div className={`h-[2px] transition-all duration-500 rounded-full ${index === currentIndex ? "w-16 lg:w-20 bg-amber-200" : "w-10 lg:w-12 bg-white/30 group-hover:w-14 group-hover:bg-white/60"}`} />
          </button>
        ))}
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-white/40 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-4 bg-amber-200"
          />
        </div>
      </motion.div>



      {/* Desktop Booking Bar Overlay */}
      <div className="absolute bottom-24 md:bottom-20 left-0 w-full z-40 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <BookingBar />
        </div>
      </div>

      {/* Mobile Booking Modal */}
      <AnimatePresence>
        {showMobileBooking && (
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 lg:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full relative"
            >
              <button 
                onClick={() => setShowMobileBooking(false)}
                className="absolute -top-16 right-0 text-white/60 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-4 py-2"
              >
                Close ✕
              </button>
              <BookingBar className="relative bottom-0! left-0! translate-x-0! px-0!" variant="overlay" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
