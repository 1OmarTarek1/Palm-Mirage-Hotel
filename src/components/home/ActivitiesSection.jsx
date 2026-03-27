import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchActivities } from "@/services/activityService";

export default function ActivitiesSection() {
  const [activities, setActivities] = useState([]);

  const pickRandomActivities = (items, count) => {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled.slice(0, count);
  };

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        const apiActivities = await fetchActivities();
        if (isMounted) {
          setActivities(pickRandomActivities(apiActivities, 2));
        }
      } catch {
        if (isMounted) {
          setActivities([]);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="activities" className="py-20 space-y-20 lg:space-y-32 overflow-hidden w-full relative">
      <div className="px-4 md:px-0">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex flex-col-reverse gap-12 lg:items-center ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } ${index !== 0 ? "mt-20 lg:mt-32" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:basis-[35%] space-y-8"
            >
              <div className="space-y-2">
                <span className="text-secondary text-xs font-bold uppercase">
                  {activity.label}
                </span>
                <h2 className="text-2xl font-header font-bold text-foreground md:text-4xl lg:text-4xl">
                  {activity.title}
                </h2>
              </div>

              <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-sm">
                {activity.description}
              </p>

              <div className="grid grid-cols-3 gap-8 pt-0">
                {activity.stats.map((stat, statIndex) => (
                  <div key={`${stat.label}-${statIndex}`} className="space-y-2">
                    <div className="text-xl font-header font-bold text-secondary/80 md:text-2xl">
                      {stat.value}
                    </div>
                    <div className="whitespace-nowrap text-[9px] font-medium uppercase tracking-tighter text-muted-foreground sm:tracking-widest md:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <motion.div>
                <Button asChild variant="palmPrimary">
                  <Link to="/services/activities">Discover More</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:basis-[65%]"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group md:rounded-[3.5rem]">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="aspect-[1.5/1] w-full object-cover transition-transform duration-700 group-hover:scale-110 lg:aspect-16/10"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
