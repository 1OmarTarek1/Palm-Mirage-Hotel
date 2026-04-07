import { memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavTooltip from "../NavTooltip";
import NavDropdown from "./NavDropdown";

/**
 * Returns true if the current URL matches the parent link OR any of its children.
 * Uses `end: true` for leaf links (no children) to avoid false matches on "/".
 */
function useIsParentActive(link) {
  const { pathname } = useLocation();

  const hasChildren = !!(link.dropdown?.length || link.megaMenu?.links?.length);
  const hasHref = typeof link.href === "string" && link.href.length > 0;

  const parentMatch = hasHref
    ? hasChildren
      ? pathname.startsWith(link.href)
      : pathname === link.href
    : false;

  const childHrefs = [
    ...(link.dropdown?.map((c) => c.href) ?? []),
    ...(link.megaMenu?.links?.map((c) => c.href) ?? []),
    ...(link.activeMatch ?? []),
  ];
  const childMatch = childHrefs.some(
    (href) => typeof href === "string" && pathname.startsWith(href),
  );

  return !!(parentMatch || childMatch);
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

function NavItem({ link, activeMenu, onToggle, onClose, triggerRef }) {
  const isActive = useIsParentActive(link);
  const hasRoute = typeof link.href === "string" && link.href.length > 0;
  const hasMenu = !!(link.dropdown || link.megaMenu);
  const isOpen = activeMenu?.label === link.label;

  return (
    <motion.li
      variants={itemVariants}
      className="relative"
    >
      <NavTooltip label={link.label}>
        {hasRoute ? (
          <NavLink
            ref={hasMenu ? triggerRef : undefined}
            to={link.href}
            end={!link.dropdown && !link.megaMenu} // exact only for leaf links
            onClick={() => (hasMenu ? onToggle(link) : onClose())}
            className={() =>
              `flex items-center justify-center w-11 h-11 rounded-full cursor-pointer
               transition-all duration-300 hover:bg-primary/20
               focus:outline-none focus-visible:outline-none focus-visible:ring-0
               ${
                 isActive
                   ? "text-primary bg-primary/20 shadow-inner border border-primary/20"
                   : "text-white/60 border border-transparent"
               }`
            }
          >
            <motion.div>{link.icon}</motion.div>
          </NavLink>
        ) : (
          <button
            type="button"
            ref={hasMenu ? triggerRef : undefined}
            onClick={() => onToggle(link)}
            aria-expanded={isOpen}
            className={`flex items-center justify-center w-11 h-11 rounded-full cursor-pointer
             transition-all duration-300 hover:bg-primary/20
             focus:outline-none focus-visible:outline-none focus-visible:ring-0
             ${
               isActive
                 ? "text-primary bg-primary/20 shadow-inner border border-primary/20"
                 : "text-white/60 border border-transparent"
             }`}
          >
            <motion.div>{link.icon}</motion.div>
          </button>
        )}
      </NavTooltip>

      {link.dropdown && (
        <AnimatePresence>
          {isOpen && (
            <NavDropdown
              links={link.dropdown}
              isOpen={true}
              onItemClick={onClose}
            />
          )}
        </AnimatePresence>
      )}
    </motion.li>
  );
}

function DesktopNav({ navLinks, activeMenu, onToggle, onClose, triggerRef }) {
  return (
    <ul className="hidden md:flex items-center gap-3 lg:gap-4 absolute left-1/2 -translate-x-1/2">
      {navLinks.map((link) => (
        <NavItem
          key={link.label}
          link={link}
          activeMenu={activeMenu}
          onToggle={onToggle}
          onClose={onClose}
          triggerRef={triggerRef}
        />
      ))}
    </ul>
  );
}

export default memo(DesktopNav);
