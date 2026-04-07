import { useEffect, useMemo, useRef, useState } from "react";
import ActivityHero from "@/components/activities/ActivityHero";
import ActivityCategories from "@/components/activities/ActivityCategories";
import ActivityDetails from "@/components/activities/ActivityDetails";
import ActivityBooking from "@/components/activities/ActivityBooking";
import SharedPagination from "@/components/common/SharedPagination";
import { ActivitiesPageSkeleton } from "@/components/activities/loading/ActivitiesPageSkeleton";
import { usePagination } from "@/hooks/usePagination";
import { useActivitiesListQuery } from "@/hooks/useCatalogQueries";

const PAGE_SIZE = 6;

export default function Activities() {
  const [activeCategory, setActiveCategory] = useState(null);
  const bookingRef = useRef(null);
  const { data: allActivities = [], isLoading } = useActivitiesListQuery();

  const filteredActivities = useMemo(
    () =>
      activeCategory
        ? allActivities.filter((activity) => activity.category === activeCategory)
        : allActivities,
    [allActivities, activeCategory]
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedActivities,
    resetPage,
  } = usePagination(filteredActivities, PAGE_SIZE);

  useEffect(() => {
    resetPage();
  }, [activeCategory, resetPage]);

  const handleBookActivity = (activityId) => {
    bookingRef.current?.selectActivity(activityId);
  };

  return (
    <div className="text-foreground antialiased overflow-x-hidden transition-colors duration-300">
      <ActivityHero />
      <div>
        <ActivityCategories
          active={activeCategory}
          onChange={setActiveCategory}
          activities={allActivities}
        />
      </div>
      {isLoading ? (
        <ActivitiesPageSkeleton />
      ) : (
        <>
          <ActivityDetails
            key={`${activeCategory ?? "all"}-${currentPage}`}
            activities={paginatedActivities}
            onBookActivity={handleBookActivity}
          />
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      <ActivityBooking ref={bookingRef} activities={allActivities} />
    </div>
  );
}
