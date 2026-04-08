import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSelector } from "react-redux";
import { navLinks } from "./navLinks";
import Logo from "./Logo";

import MobileMenuButton from "./Mobile/MobileMenuButton";
import DesktopNav from "./Desktop/DesktopNav";
import MobileNav from "./Mobile/MobileNav";
import NavActions from "./Desktop/NavActions";
import MegaMenu from "./Desktop/MegaMenu";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";
import WishlistButton from "./WishlistButton";
import NotificationButton from "./NotificationButton";

const MotionNav = motion.nav;
const MotionDiv = motion.div;

const CIRCLE_RADIUS = 32;

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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [introStage, setIntroStage] = useState("drop");
  const { scrollY } = useScroll();
  const hiddenRef = useRef(false);
  const megaMenuRef = useRef(null);
  const megaTriggerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

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

  const handleMenuToggle = useCallback((link) => {
    if (!link?.megaMenu && !link?.dropdown) {
      setActiveMenu(null);
      return;
    }
    setActiveMenu((prev) => (prev?.label === link.label ? null : link));
  }, []);

  const handleAnimationComplete = useCallback((def) => {
    if (def === "drop") setIntroStage("expand");
    else if (def === "expand") setIntroStage("done");
  }, []);

  const toggleMobile = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsOpen(false), []);
  const clearMenu = useCallback(() => setActiveMenu(null), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!activeMenu) return;

      const target = event.target;
      const clickedInsideMega = megaMenuRef.current?.contains(target);
      const clickedTrigger = megaTriggerRef.current?.contains(target);

      if (clickedInsideMega || clickedTrigger) return;
      setActiveMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  useEffect(() => {
    if (!activeMenu) return;
    const handleScrollClose = () => setActiveMenu(null);
    window.addEventListener("scroll", handleScrollClose, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollClose);
  }, [activeMenu]);

  useEffect(() => {
    if (!isOpen) return;

    const handleMobileOutsideClick = (event) => {
      const target = event.target;
      const clickedMenu = mobileMenuRef.current?.contains(target);
      const clickedToggle = mobileMenuButtonRef.current?.contains(target);

      // Keep burger button behavior intact (it already toggles open/close).
      if (clickedToggle || clickedMenu) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleMobileOutsideClick);
    return () => document.removeEventListener("mousedown", handleMobileOutsideClick);
  }, [isOpen]);

  const introDone = introStage === "done";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-1 sm:px-2 md:px-3! lg:px-5 py-3">
      <div className="px-2 md:px-0 lg:max-w-7xl mx-auto relative lg:px-2 pl-1">
        <div className="relative flex justify-center">
        <MotionNav
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
          className="relative flex items-center justify-between w-full px-2.5 md:px-3 h-14 md:h-16 bg-primary/20 backdrop-blur-xl backdrop-brightness-50 border border-white/20 rounded-full shadow-2xl z-20"
        >
          <MotionDiv
            className="flex items-center justify-between w-full h-full relative"
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
            variants={contentVariants}
            style={{ pointerEvents: introDone ? "auto" : "none" }}
          >
            <MotionDiv
              variants={slideInLeft}
              className="md:hidden flex items-center gap-1 shrink-0 z-10"
            >
              <MobileMenuButton
                isOpen={isOpen}
                onToggle={toggleMobile}
                buttonRef={mobileMenuButtonRef}
              />
              {isAuthenticated && <WishlistButton />}
            </MotionDiv>

            <MotionDiv variants={slideInLeft} className="hidden md:block">
              <Logo />
            </MotionDiv>

            <DesktopNav
              navLinks={navLinks}
              activeMenu={activeMenu}
              onToggle={handleMenuToggle}
              onClose={clearMenu}
              triggerRef={megaTriggerRef}
            />

            <NavActions
              activeMenu={activeMenu}
            />

            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
              <MotionDiv variants={slideInUp}>
                <Logo mobileIconOnly />
              </MotionDiv>
            </div>

            <MotionDiv
              variants={slideInUp}
              className="flex items-center md:hidden gap-1 shrink-0 z-10"
            >
              {isAuthenticated && <NotificationButton />}
              {isAuthenticated && <CartButton />}
              <LoginButton />
            </MotionDiv>
          </MotionDiv>
        </MotionNav>
        </div>

        <AnimatePresence>
          {activeMenu?.megaMenu && (
            <MegaMenu
              content={activeMenu.megaMenu}
              isOpen={!!activeMenu}
              onItemClick={clearMenu}
              containerRef={megaMenuRef}
            />
          )}
        </AnimatePresence>

        <MobileNav
          navLinks={navLinks}
          isOpen={isOpen}
          onClose={closeMobile}
          containerRef={mobileMenuRef}
        />
      </div>
    </header>
  );
}
