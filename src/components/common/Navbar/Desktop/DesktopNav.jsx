import { memo } from "react";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavTooltip from "../NavTooltip";
import NavDropdown from "./NavDropdown";

/**
 * Returns true if the current URL matches the parent link OR any of its children.
 * Uses `end: true` for leaf links (no children) to avoid false matches on "/".
 */
function useIsParentActive(link) {
  const hasChildren = !!(link.dropdown?.length || link.megaMenu?.links?.length);
  const resolved = useResolvedPath(link.href);
  // end:true for leaf links (like Home "/") — only exact match
  // end:false for parents with children — match /activities AND /activities/hiking
  const parentMatch = useMatch({ path: resolved.pathname, end: !hasChildren });

  // Also check if current path starts with any child href
  const childHrefs = [
    ...(link.dropdown?.map((c) => c.href) ?? []),
    ...(link.megaMenu?.links?.map((c) => c.href) ?? []),
  ];
  const currentPath = window.location.pathname;
  const childMatch = childHrefs.some((href) => currentPath.startsWith(href));

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

function NavItem({ link, activeMenu, onHover, onLeave }) {
  const isActive = useIsParentActive(link);

  return (
    <motion.li
      variants={itemVariants}
      onMouseEnter={() => onHover(link)}
      onMouseLeave={onLeave}
      className="relative"
    >
      <NavTooltip label={link.label}>
        <NavLink
          to={link.href}
          end={!link.dropdown && !link.megaMenu} // exact only for leaf links
          className={() =>
            `flex items-center justify-center w-11 h-11 rounded-full
             transition-all duration-300 hover:bg-primary/20
             ${isActive
               ? "text-primary bg-primary/20 shadow-inner border border-primary/20"
               : "text-white/60"
             }`
          }
        >
          <motion.div>
            {link.icon}
          </motion.div>
        </NavLink>
      </NavTooltip>

      {link.dropdown && (
        <AnimatePresence>
          {activeMenu?.label === link.label && (
            <NavDropdown
              links={link.dropdown}
              isOpen={true}
              onMouseEnter={() => onHover(link)}
              onMouseLeave={onLeave}
              onItemClick={() => onLeave()}
            />
          )}
        </AnimatePresence>
      )}
    </motion.li>
  );
}

function DesktopNav({ navLinks, activeMenu, onHover, onLeave }) {
  return (
    <ul className="hidden md:flex items-center gap-3 lg:gap-4 absolute left-1/2 -translate-x-1/2">
      {navLinks.map((link) => (
        <NavItem
          key={link.label}
          link={link}
          activeMenu={activeMenu}
          onHover={onHover}
          onLeave={onLeave}
        />
      ))}
    </ul>
  );
}

export default memo(DesktopNav);
