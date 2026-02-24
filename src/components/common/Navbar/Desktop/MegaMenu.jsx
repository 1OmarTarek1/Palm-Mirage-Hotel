import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export default function MegaMenu({ content, isOpen, onMouseEnter, onMouseLeave, onItemClick }) {
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        absolute top-full left-0 right-0 mt-4 overflow-hidden
        bg-card backdrop-blur-2xl
        border border-border/50 rounded-[2rem] shadow-2xl
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      <div className="flex p-6 gap-6">

        {/* Left Side: title + 2-col links grid — 50% */}
        <div className="w-[55%] pr-6 border-r border-border/50">
          {/* Section label */}
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground pb-3 mb-8 border-b border-primary/20">
            {content.title}
          </p>

          {/* 2-column grid of links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {content.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 transition-opacity duration-200 ${isActive ? "opacity-100" : "hover:opacity-80"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Circular icon */}
                    <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${isActive ? "bg-primary/30 text-primary" : "bg-primary/20 text-primary group-hover:bg-primary/10"}`}>
                      {link.icon}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "text-foreground group-hover:text-primary"}`}>
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right Side: featured image with promo overlay */}
        {content.featuredImage && (
          <div className="w-[45%] shrink-0 pl-0">
            <div className="relative rounded-2xl overflow-hidden h-[300px]">
              <img
                src={content.featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Promo caption */}
              {content.promotion && (
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">
                      {content.promotion.title}
                    </p>
                    <p className="text-white/80 text-xs mt-0.5">
                      {content.promotion.subtitle}
                    </p>
                  </div>
                  <Link
                    to={content.promotion.href}
                    onClick={onItemClick}
                    className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur-sm transition-colors duration-200"
                  >
                    <ArrowRight size={16} className="text-[#fefefe]" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
