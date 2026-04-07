import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import NavTooltip from "./NavTooltip";
import MobileAccordion from "./Mobile/MobileAccordion";
import NavDropdown from "./Desktop/NavDropdown";
import { selectLocale, setLocale, toggleLocale } from "@/store/slices/localeSlice";
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionButton = motion.button;

const LANGUAGES = [
  { code: "EN", label: "English", href: "#" },
  { code: "AR", label: "العربية", href: "#" },
];

const menuEase = [0.22, 1, 0.36, 1];

const pillSpring = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.65,
};

const langLabelMotion = {
  initial: { opacity: 0, y: 4, filter: "blur(3px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.26, ease: menuEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: "blur(3px)",
    transition: { duration: 0.18, ease: menuEase },
  },
};

function LocalePillSwitch({ currentLang, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={currentLang === "AR"}
      aria-label={currentLang === "EN" ? "Switch to Arabic" : "Switch to English"}
      onClick={onToggle}
      className="relative h-7 w-[3.35rem] shrink-0 cursor-pointer rounded-full border border-border/40 bg-muted/35 shadow-inner transition-[box-shadow,background-color] duration-300 ease-out hover:bg-muted/45"
    >
      <span
        className={`pointer-events-none absolute left-1.5 top-1/2 z-[1] -translate-y-1/2 text-[11px] font-bold leading-none transition-[color,opacity] duration-300 ease-out ${
          currentLang === "AR" ? "text-primary" : "text-muted-foreground/45"
        }`}
      >
        ع
      </span>
      <span
        className={`pointer-events-none absolute right-1.5 top-1/2 z-[1] -translate-y-1/2 text-[9px] font-bold leading-none tracking-tight transition-[color,opacity] duration-300 ease-out ${
          currentLang === "EN" ? "text-primary" : "text-muted-foreground/45"
        }`}
      >
        EN
      </span>
      <MotionSpan
        className="pointer-events-none absolute top-1/2 z-[2] size-[1.125rem] -translate-y-1/2 rounded-full border border-border/50 bg-background shadow-md"
        initial={false}
        animate={{
          left: currentLang === "EN" ? "3px" : "calc(100% - 1.125rem - 3px)",
        }}
        transition={pillSpring}
      />
    </button>
  );
}

export default function LanguageToggle({
  mobile = false,
  embedded = false,
  settingsCard = false,
  isExpanded,
  onToggle,
  onClose,
}) {
  const dispatch = useDispatch();
  const currentLang = useSelector(selectLocale);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const icon = <Languages size={mobile ? 15 : 20} />;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleScrollClose = () => setOpen(false);
    window.addEventListener("scroll", handleScrollClose, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollClose);
  }, [open]);

  if (settingsCard) {
    const active = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];
    return (
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages size={20} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Language</p>
            <p className="text-xs text-muted-foreground truncate">{active.label}</p>
          </div>
        </div>
        <LocalePillSwitch currentLang={currentLang} onToggle={() => dispatch(toggleLocale())} />
      </div>
    );
  }

  if (embedded) {
    const active = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];
    return (
      <MotionDiv
        layout={false}
        className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition-[background-color] duration-300 ease-out hover:bg-primary/10"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Languages size={16} className="shrink-0 text-foreground/70" aria-hidden />
          <div className="relative min-h-[1.35em] min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <MotionSpan
                key={active.code}
                variants={langLabelMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="block truncate"
              >
                {active.label}
              </MotionSpan>
            </AnimatePresence>
          </div>
        </div>
        <LocalePillSwitch currentLang={currentLang} onToggle={() => dispatch(toggleLocale())} />
      </MotionDiv>
    );
  }

  if (mobile) {
    return (
      <MobileAccordion
        label={`Language: ${currentLang}`}
        icon={icon}
        isExpanded={isExpanded}
        onToggle={onToggle}
        hasSubItems={true}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              dispatch(setLocale(lang.code));
              onClose?.();
            }}
            className={`
              w-full text-left py-2.5 px-3 rounded-lg text-xs transition-all cursor-pointer
              ${currentLang === lang.code ? "text-primary font-bold bg-primary/20" : "text-white/60 hover:text-white hover:bg-white/5"}
            `}
          >
            {lang.label}
          </button>
        ))}
      </MobileAccordion>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <NavTooltip label="Language">
        <MotionButton
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-primary/5 hover:bg-primary/20 transition-all text-white/60 border border-white/10 cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          aria-label="Toggle Language"
          aria-expanded={open}
        >
          {icon}
        </MotionButton>
      </NavTooltip>

      <AnimatePresence>
        {open && (
          <NavDropdown
            links={LANGUAGES.map((l) => ({
              ...l,
              isActive: currentLang === l.code,
              onClick: () => {
                dispatch(setLocale(l.code));
                setOpen(false);
              },
            }))}
            isOpen={true}
            isRouterLink={false}
            onItemClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
