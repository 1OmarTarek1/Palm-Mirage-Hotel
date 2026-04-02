import { useEffect, useMemo, useRef, useState } from "react";
import ActivityHero from "@/components/activities/ActivityHero";
import ActivityCategories from "@/components/activities/ActivityCategories";
import ActivityDetails from "@/components/activities/ActivityDetails";
import ActivityBooking from "@/components/activities/ActivityBooking";
import { fetchActivities } from "@/services/activityService";

export default function Activities() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bookingRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const apiActivities = await fetchActivities();
        if (isMounted) {
          setActivities(apiActivities);
        }
      } catch {
        if (isMounted) {
          setActivities([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory
        ? activities.filter((activity) => activity.category === activeCategory)
        : activities,
    [activities, activeCategory]
  );

  const handleBookActivity = (activityId) => {
    bookingRef.current?.selectActivity(activityId);
  };

  return (
    <div className="text-foreground antialiased overflow-x-hidden transition-colors duration-300">
      <ActivityHero />
      <ActivityCategories
        active={activeCategory}
        onChange={setActiveCategory}
        activities={activities}
      />
      {isLoading ? (
        <section className="pb-16 text-center text-sm text-muted-foreground">
          Loading activities...
        </section>
      ) : (
        <ActivityDetails activities={filtered} onBookActivity={handleBookActivity} />
      )}
      <ActivityBooking ref={bookingRef} activities={activities} />
    </div>
  );
}
