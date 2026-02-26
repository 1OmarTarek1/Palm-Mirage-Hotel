import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks } from "./navLinks";
import Logo from "./Logo";

import MobileMenuButton from "./Mobile/MobileMenuButton";
import DesktopNav from "./Desktop/DesktopNav";
import MobileNav from "./Mobile/MobileNav";
import NavActions from "./Desktop/NavActions";
import MegaMenu from "./Desktop/MegaMenu";
import CartButton from "./CartButton";


// Navbar height in px — used to make a perfect circle on drop
const CIRCLE_SIZE = 56;

// Intro animation: true circle drops from top, then expands to full width
const introVariants = {
  initial: {
    y: -120,
    width: CIRCLE_SIZE,
    opacity: 0,
    borderRadius: "9999px",
  },
  drop: {
    y: 0,
    width: CIRCLE_SIZE,
    opacity: 1,
    borderRadius: "9999px",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 0.8,
    },
  },
  expand: {
    y: 0,
    width: "100%",
    opacity: 1,
    borderRadius: "9999px",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 1,
      delay: 0.05,
    },
  },
};

// Scroll hide/show variants (applied after intro is done)
const scrollVariants = {
  visible: { y: 0, opacity: 1, width: "100%" },
  hidden: { y: -100, opacity: 0, width: "100%" },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [introStage, setIntroStage] = useState("drop"); // "drop" | "expand" | "done"
  const { scrollY } = useScroll();
  const timeoutRef = useRef(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (introStage !== "done") return;
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
      setActiveMenu(null);
      setIsOpen(false);
    } else {
      setHidden(false);
    }
  });

  const handleMouseEnter = (link) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(link);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const keepOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-1 sm:px-2 md:px-3! lg:px-5 py-3 ">
      <div className="px-2 md:px-0 lg:max-w-7xl mx-auto relative lg:px-2">
        <div className="flex justify-center">
        <motion.nav
          variants={introStage !== "done" ? introVariants : scrollVariants}
          initial={introStage !== "done" ? "initial" : false}
          animate={
            introStage === "drop"
              ? "drop"
              : introStage === "expand"
              ? "expand"
              : hidden
              ? "hidden"
              : "visible"
          }
          onAnimationComplete={(def) => {
            if (def === "drop") {
              setIntroStage("expand");
            } else if (def === "expand") {
              setIntroStage("done");
            }
          }}
          transition={
            introStage === "done"
              ? { duration: 0.35, ease: "easeInOut" }
              : undefined
          }
          className={`relative flex items-center justify-between px-2 h-14 bg-primary/50 backdrop-blur-xl border border-primary/20 rounded-full shadow-2xl z-20 ${introStage !== "done" ? "overflow-hidden" : ""}`}
        >
          <motion.div
            className="flex items-center justify-between w-full h-full"
            initial="hidden"
            animate={introStage === "done" ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.08,
                  delayChildren: 0.1
                }
              }
            }}
            style={{ pointerEvents: introStage === "done" ? "auto" : "none" }}
          >
            <motion.div
              variants={{
                hidden: { x: -30, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
            >
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
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
              className="flex items-center md:hidden gap-2"
            >
              <CartButton />
              <MobileMenuButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
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
              onItemClick={() => setActiveMenu(null)}
            />
          )}
        </AnimatePresence>

        <MobileNav navLinks={navLinks} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </header>
  );
}
