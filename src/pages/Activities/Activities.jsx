import { useState } from "react";
import { ACTIVITIES_DATA } from "@/data/activitiesData";
import ActivityHero from "@/components/activities/ActivityHero";
import ActivityCategories from "@/components/activities/ActivityCategories";
import ActivityDetails from "@/components/activities/ActivityDetails";
import ActivityBooking from "@/components/activities/ActivityBooking";

export default function Activities() {
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = activeCategory
    ? ACTIVITIES_DATA.filter((a) => a.category === activeCategory)
    : ACTIVITIES_DATA;

  return (
    <div className="text-foreground antialiased overflow-x-hidden transition-colors duration-300">
      <ActivityHero />
      <ActivityCategories active={activeCategory} onChange={setActiveCategory} />
      <ActivityDetails activities={filtered} />
      {/* <ActivityBooking /> */}
    </div>
  );
}
