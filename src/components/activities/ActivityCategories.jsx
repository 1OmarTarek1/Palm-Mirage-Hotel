import { useMemo, useRef } from "react";
import {
  Ship,
  Landmark,
  Mountain,
  Palette,
  CloudSun,
  ChefHat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ICON_MAP = {
  Ship: Ship,
  Landmark: Landmark,
  Mountain: Mountain,
  Palette: Palette,
  CloudSun: CloudSun,
  ChefHat: ChefHat,
};

const formatCategoryLabel = (categoryId) =>
  categoryId
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function ActivityCategories({ active, onChange, activities = [] }) {
  const scrollRef = useRef(null);
  const categories = useMemo(() => {
    const seen = new Set();

    return activities
      .filter((activity) => {
        if (!activity.category || seen.has(activity.category)) return false;
        seen.add(activity.category);
        return true;
      })
      .map((activity) => ({
        id: activity.category,
        label: formatCategoryLabel(activity.category),
        icon: activity.icon,
      }));
  }, [activities]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Amount to scroll: roughly one card width + gap
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleClick = (categoryId) => {
    if (active === categoryId) {
      // Clicking the same category resets to show all
      onChange(null);
    } else {
      onChange(categoryId);
      // Scroll to the first activity of that category
      const first = activities.find((activity) => activity.category === categoryId);
      if (first) {
        setTimeout(() => {
          document
            .getElementById(first.id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  };

  return (
    <section className="py-15">
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="text-left">
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">
            What Awaits You
          </span>
          <h2 className="text-3xl sm:text-4xl font-header font-bold text-foreground mb-4">
            Explore By Category
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Choose a category to discover curated experiences, or browse them all
            below.
          </p>
        </div>
        <div className="flex items-center justify-start gap-4">
          <button 
            onClick={() => scroll("left")} 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory pt-2 px-1 hide-scroll"
      >
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          const isActive = active === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`
                shrink-0 min-w-[160px] sm:min-w-[180px] lg:min-w-[190px] snap-start
                group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? "bg-secondary/15 border-secondary/50 shadow-lg shadow-secondary/10"
                    : "bg-card border-border hover:border-secondary/30 hover:shadow-md"
                }
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-300
                  ${
                    isActive
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary"
                  }
                `}
              >
                {Icon && <Icon size={20} strokeWidth={1.5} />}
              </div>
              <span
                className={`
                  text-xs font-bold text-center leading-tight transition-colors duration-300
                  ${
                    isActive
                      ? "text-secondary"
                      : "text-foreground group-hover:text-secondary"
                  }
                `}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="text-center mt-6">
          <button
            onClick={() => onChange(null)}
            className="text-xs text-muted-foreground hover:text-secondary transition-colors underline underline-offset-4 cursor-pointer"
          >
            Show All Activities
          </button>
        </div>
      )}
    </section>
  );
}
