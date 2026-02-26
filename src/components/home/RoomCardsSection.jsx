import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";

import { DUMMY_ROOMS as rooms  } from "@/utils/constants";

// change this links for demo and make it shared
// const rooms = [
//   {
//     id: 1,
//     type: "DELUXE ROOM",
//     name: "Alpine King Deluxe",
//     price: 180,
//     beds: 1,
//     size: 50,
//     guests: 1,
//     image:
//       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop",
//   },
//   {
//     id: 2,
//     type: "DELUXE ROOM",
//     name: "Twin Peaks Tower",
//     price: 160,
//     beds: 1,
//     size: 60,
//     guests: 1,
//     image:
//       "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop",
//   },
//   {
//     id: 3,
//     type: "SUITE",
//     name: "Mountain View Suite",
//     price: 280,
//     beds: 2,
//     size: 90,
//     guests: 2,
//     image:
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop",
//   },
//   {
//     id: 4,
//     type: "JUNIOR SUITE",
//     name: "Forest Retreat",
//     price: 220,
//     beds: 1,
//     size: 75,
//     guests: 2,
//     image:
//       "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1470&auto=format&fit=crop",
//   },
//   {
//     id: 5,
//     type: "PENTHOUSE",
//     name: "Summit Penthouse",
//     price: 450,
//     beds: 3,
//     size: 150,
//     guests: 4,
//     image:
//       "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1470&auto=format&fit=crop",
//   },
// ];

export default function RoomCardsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const dragX = useMotionValue(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth < 1024 ? 1 : 2);
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, rooms.length - visibleCount);

  const prev = () => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((p) => Math.max(0, p - 1));
  };

  const next = () => {
    if (current >= maxIndex) return;
    setDirection(1);
    setCurrent((p) => Math.min(maxIndex, p + 1));
  };

  const handleDragEnd = (_, info) => {
    const threshold = 80;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  return (
    <section className="py-10 bg-background overflow-hidden">
      <div className="">
        {/* Header */}
        <div className="flex flex-col mb-8">
          <span className="text-md uppercase text-muted-foreground font-bold mb-3 block">
            STAY IN STYLE
          </span>
          <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap lg:items-center justify-between gap-8 lg:gap-16">
            <h2 className="text-4xl md:text-4xl lg:text-3xl font-header text-foreground leading-tight whitespace-nowrap font-bold">
              Take Your Time
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground flex-1 leading-relaxed font-medium lg:max-w-2xl">
              Experience the natural beauty of our O'ahu resort in any setting — private oceanfront
              bungalow, lavish suite, or ocean view room.
            </p>

            <Button
              asChild
              className="shrink-0 self-start md:w-full lg:w-auto lg:self-center"
            >
              <Link to="/rooms">View All Accommodations</Link>
            </Button>
          </div>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="secondary"
            size="icon"
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous room"
            className="hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-card shadow-lg border border-border/50 text-foreground"
          >
            <ChevronLeft size={24} />
          </Button>

          {/* Track */}
          <div className="overflow-hidden p-1">
            <motion.div
              ref={trackRef}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              animate={{ x: 0 }}
              className="flex gap-8 cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence initial={false} custom={direction}>
                {rooms.map((room, index) => {
                  const offset = index - current;
                  const isVisible = offset >= 0 && offset < visibleCount;

                  return (
                    <motion.div
                      key={room.id}
                      custom={direction}
                      animate={{
                        x: `calc(${-current * 100}% - ${current * 32}px)`,
                        opacity: isVisible ? 1 : 0.4,
                        scale: isVisible ? 1 : 0.98,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className="shrink-0"
                      style={{ 
                         width: visibleCount === 1 ? "100%" : "calc(50% - 16px)",
                         minWidth: visibleCount === 1 ? "100%" : "calc(50% - 16px)"
                      }}
                    >
                      <RoomCard room={room} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <Button
            variant="secondary"
            size="icon"
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Next room"
            className="hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-card border border-border/50 text-foreground"
          >
            <ChevronRight size={24} />
          </Button>
        </div>

        {/* Mobile swipe hint & dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Prev arrow (mobile) */}
          <motion.button
            onClick={prev}
            disabled={current === 0}
            className="sm:hidden w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground"
          >
            <ChevronLeft size={16} />
          </motion.button>

          {/* Dots */}
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`Go to room ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-7 h-2.5 bg-primary"
                  : "w-2.5 h-2.5 bg-border hover:bg-primary/50"
              }`}
            />
          ))}

          {/* Next arrow (mobile) */}
          <motion.button
            onClick={next}
            disabled={current >= maxIndex}
            className="sm:hidden w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
