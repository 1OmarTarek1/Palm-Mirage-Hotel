import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sectionsData = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About Luxor" },
  { id: "rooms", label: "Our Rooms" },
  { id: "platforms", label: "Global Reach" },
  { id: "experience", label: "The Experience" },
  { id: "amenities", label: "Awards" },
  { id: "activities", label: "Activities" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact Us" },
];

const getSectionElement = (id) =>
  document.getElementById(id) ??
  document.querySelector(`[data-section-anchor="${id}"]`);

export default function SectionNavigator() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [orderedSections, setOrderedSections] = useState(sectionsData);
  const sectionObserverRef = useRef(null);

  const getAvailableSections = useCallback(() => {
    return sectionsData.filter((section) => getSectionElement(section.id));
  }, []);

  const sortSectionsByDOM = useCallback(() => {
    const sorted = [...sectionsData].sort((a, b) => {
      const elA = getSectionElement(a.id);
      const elB = getSectionElement(b.id);

      if (!elA && !elB) return 0;
      if (!elA) return 1;
      if (!elB) return -1;

      const rectA = elA.getBoundingClientRect();
      const rectB = elB.getBoundingClientRect();
      const topA = rectA.top + window.scrollY;
      const topB = rectB.top + window.scrollY;

      return topA - topB;
    });

    setOrderedSections(sorted);
  }, []);

  const bindSectionObserver = useCallback(() => {
    sectionObserverRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    getAvailableSections().forEach((section) => {
      const element = getSectionElement(section.id);
      if (element) observer.observe(element);
    });

    sectionObserverRef.current = observer;
  }, [getAvailableSections]);

  // Determine section order based on actual DOM position
  useEffect(() => {
    const refreshNavigator = () => {
      sortSectionsByDOM();
      bindSectionObserver();
    };

    const timeoutId = window.setTimeout(refreshNavigator, 100);
    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(refreshNavigator);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", refreshNavigator);
    
    return () => {
      window.clearTimeout(timeoutId);
      mutationObserver.disconnect();
      sectionObserverRef.current?.disconnect();
      window.removeEventListener("resize", refreshNavigator);
    };
  }, [bindSectionObserver, sortSectionsByDOM]);

  const scrollToSection = (id) => {
    const element = getSectionElement(id);
    if (element) {
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const activeIndex = orderedSections.findIndex(s => s.id === activeSection);
  const progressPercent = orderedSections.length > 1 ? (Math.max(0, activeIndex) / (orderedSections.length - 1)) * 100 : 0;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center group">
      {/* Background Line Container (Aligned with dot centers) */}
      <div className="absolute top-[28px] bottom-[28px] w-[2px] bg-primary/20 rounded-full overflow-hidden">
        {/* Animated Progress Line */}
        <motion.div 
          initial={false}
          animate={{ height: `${progressPercent}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
          className="absolute top-0 left-0 w-full bg-primary origin-top shadow-[0_0_10px_rgba(var(--primary),0.5)]"
        />
      </div>

      {/* Nav Points */}
      <div className="flex flex-col gap-8 py-4">
        {orderedSections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = index <= activeIndex;
          const isHovered = hoveredSection === section.id;
          const showTooltip = isActive || isHovered;

          return (
            <div 
              key={section.id} 
              className="relative flex items-center justify-center h-6"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Tooltip */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: showTooltip ? 1 : 0,
                  x: showTooltip ? 0 : -10 
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "absolute left-full ml-2 px-3 py-1.5 rounded-lg text-xs font-header font-bold whitespace-nowrap border backdrop-blur-md transition-colors pointer-events-none",
                  isActive 
                    ? "bg-primary text-white border-primary" 
                    : "bg-card/90 text-primary border-border/50"
                )}
              >
                {section.label}
              </motion.div>

              {/* Dot */}
              <button
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center justify-center w-6 h-6 outline-none cursor-pointer"
                aria-label={`Scroll to ${section.label}`}
              >
                {/* Inner Dot */}
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.3 : 1
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 pointer-events-none",
                    isPassed 
                      ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" 
                      : isHovered 
                        ? "bg-primary/50" 
                        : "bg-foreground/20" 
                  )}
                />
                
                {/* Outer Ring on Hover/Active */}
                <motion.div
                  animate={{ 
                    scale: isActive || isHovered ? 1 : 0,
                    opacity: isActive || isHovered ? 1 : 0
                  }}
                  className="absolute inset-0 rounded-full border border-primary/30 pointer-events-none"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
