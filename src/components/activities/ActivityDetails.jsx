import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

const formatPrice = (value) => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getActivityId = (activity) => activity.id || activity._id || "";

const getActivityImage = (activity) => activity.image?.url || activity.image || "";

export default function ActivityDetails({ activities, onBookActivity }) {
  
  if (!activities || activities.length === 0) {
    return (
      <section className="text-center">
        <p className="text-muted-foreground">No activities found for this category.</p>
      </section>
    );
  }

  return (
    <section className="space-y-20 pb-16 sm:pb-20 lg:space-y-28">
      {activities.map((activity, index) => {
        const activityId = getActivityId(activity);
        const image = getActivityImage(activity);
        
        return (
          <motion.div
            key={activityId || activity.title}
            id={activityId}
            initial={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="scroll-mt-24"
          >
            <div
              className={`flex flex-col gap-10 lg:items-center lg:gap-16 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div className="w-full lg:basis-[55%]">
                <div className="group overflow-hidden rounded-[2rem] shadow-2xl md:rounded-[2.5rem]">
                  {image ? (
                    <img
                      src={image}
                      alt={activity.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-3/2 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-3/2 w-full bg-linear-to-br from-primary/25 via-primary/10 to-transparent" />
                  )}
                </div>
              </div>

              <div className="space-y-6 lg:basis-[45%]">
                <div className="space-y-2">
                  <span className="text-secondary text-[11px] font-bold uppercase tracking-[0.15em]">
                    {activity.label || activity.category}
                  </span>
                  <h3 className="font-header text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    {activity.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activity.description}
                </p>

                <div className="grid grid-cols-1 gap-6 border-t border-border/50 pt-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <div className="font-header text-xl font-bold text-secondary/80 sm:text-2xl">
                      {formatPrice(activity.basePrice)}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Starting From
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-header text-xl font-bold text-secondary/80 sm:text-2xl">
                      {activity.durationMinutes || 0} min
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Duration
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-header text-base font-bold text-secondary/80 sm:text-lg">
                      {activity.location || "Palm Hotel"}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Meeting Point
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link to={`/services/activities/${activityId}`} className="sm:flex-1">
                    <Button className="w-full" variant="palmSecondary">
                      Details
                    </Button>
                  </Link>

                  <Button
                    className="sm:flex-1"
                    onClick={() => onBookActivity?.(activityId)}
                    type="button"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
