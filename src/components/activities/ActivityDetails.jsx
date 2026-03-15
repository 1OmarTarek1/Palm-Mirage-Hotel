import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ActivityDetails({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <section className="text-center">
        <p className="text-muted-foreground">No activities found for this category.</p>
      </section>
    );
  }

  return (
    <section className="pb-16 sm:pb-20 space-y-20 lg:space-y-28">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          id={activity.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="scroll-mt-24"
        >
          <div
            className={`flex flex-col gap-10 lg:gap-16 lg:items-center ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* Image */}
            <div className="lg:basis-[55%] w-full">
              <div className="group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
                <img
                  src={activity.image}
                  alt={activity.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-3/2 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:basis-[45%] space-y-6">
              <div className="space-y-2">
                <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.15em]">
                  {activity.label}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-header font-bold text-foreground leading-tight">
                  {activity.title}
                </h3>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {activity.description}
              </p>

              {/* Highlights */}
              {activity.highlights && activity.highlights.length > 0 && (
                <ul className="space-y-2.5 pt-2">
                  {activity.highlights.map((hl, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <div className="shrink-0 w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center">
                        <Check
                          size={12}
                          strokeWidth={2.5}
                          className="text-secondary"
                        />
                      </div>
                      {hl}
                    </li>
                  ))}
                </ul>
              )}

              {/* Stats */}
              {activity.stats && activity.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/50">
                  {activity.stats.map((stat, sIndex) => (
                    <div key={sIndex} className="space-y-1">
                      <div className="text-xl sm:text-2xl font-header font-bold text-secondary/80">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
