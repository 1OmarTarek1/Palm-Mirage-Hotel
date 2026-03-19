import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks } from "./navLinks";
import Logo from "./Logo";

import MobileMenuButton from "./Mobile/MobileMenuButton";
import DesktopNav from "./Desktop/DesktopNav";
import MobileNav from "./Mobile/MobileNav";
import NavActions from "./Desktop/NavActions";
import MegaMenu from "./Desktop/MegaMenu";
import CartButton from "./CartButton";

const CIRCLE_RADIUS = 28;

const introVariants = {
  initial: {
    y: -120,
    opacity: 0,
    clipPath: `circle(${CIRCLE_RADIUS}px at 50% 50%)`,
  },
  drop: {
    y: 0,
    opacity: 1,
    clipPath: `circle(${CIRCLE_RADIUS}px at 50% 50%)`,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 0.8,
    },
  },
  expand: {
    y: 0,
    opacity: 1,
    clipPath: `circle(1200px at 50% 50%)`,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 1,
      delay: 0.05,
    },
  },
};

const scrollVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: -100, opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const slideInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [introStage, setIntroStage] = useState("drop");
  const { scrollY } = useScroll();
  const timeoutRef = useRef(null);
  const hiddenRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (introStage !== "done") return;
    const previous = scrollY.getPrevious();
    const delta = latest - previous;
    if (delta > 5 && latest > 150) {
      if (!hiddenRef.current) {
        hiddenRef.current = true;
        setHidden(true);
        setActiveMenu(null);
        setIsOpen(false);
      }
    } else if (delta < -5) {
      if (hiddenRef.current) {
        hiddenRef.current = false;
        setHidden(false);
      }
    }
  });

  const handleMouseEnter = useCallback((link) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(link);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  }, []);

  const keepOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleAnimationComplete = useCallback((def) => {
    if (def === "drop") setIntroStage("expand");
    else if (def === "expand") setIntroStage("done");
  }, []);

  const toggleMobile = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsOpen(false), []);
  const clearMenu = useCallback(() => setActiveMenu(null), []);

  const introDone = introStage === "done";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-1 sm:px-2 md:px-3! lg:px-5 py-3">
      <div className="px-2 md:px-0 lg:max-w-7xl mx-auto relative lg:px-2 pl-1">
        <div className="relative flex justify-center">
        <motion.nav
          variants={!introDone ? introVariants : scrollVariants}
          initial={!introDone ? "initial" : false}
          animate={
            introStage === "drop"
              ? "drop"
              : introStage === "expand"
              ? "expand"
              : hidden
              ? "hidden"
              : "visible"
          }
          onAnimationComplete={handleAnimationComplete}
          transition={
            introDone
              ? { duration: 0.35, ease: "easeInOut" }
              : undefined
          }
          style={{ willChange: "transform" }}
          className="relative flex items-center justify-between w-full px-2 h-14 bg-primary/20 backdrop-blur-xl backdrop-brightness-50 border border-white/20 rounded-full shadow-2xl z-20"
        >
          <motion.div
            className="flex items-center justify-between w-full h-full"
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
            variants={contentVariants}
            style={{ pointerEvents: introDone ? "auto" : "none" }}
          >
            <motion.div variants={slideInLeft}>
              <Logo />
            </motion.div>
            
            <DesktopNav
              navLinks={navLinks}
              activeMenu={activeMenu}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            
            <NavActions
              activeMenu={activeMenu}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            
            <motion.div
              variants={slideInUp}
              className="flex items-center md:hidden gap-2"
            >
              <CartButton />
              <MobileMenuButton isOpen={isOpen} onToggle={toggleMobile} />
            </motion.div>
          </motion.div>
        </motion.nav>
        </div>

        <AnimatePresence>
          {activeMenu?.megaMenu && (
            <MegaMenu
              content={activeMenu.megaMenu}
              isOpen={!!activeMenu}
              onMouseEnter={keepOpen}
              onMouseLeave={handleMouseLeave}
              onItemClick={clearMenu}
            />
          )}
        </AnimatePresence>

        <MobileNav navLinks={navLinks} isOpen={isOpen} onClose={closeMobile} />
      </div>
    </header>
  );
}
