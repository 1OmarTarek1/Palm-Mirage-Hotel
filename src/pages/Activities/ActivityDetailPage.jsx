import { useEffect, useMemo, useRef, useState } from "react";
import ActivityBooking from "@/components/activities/ActivityBooking";
import ActivityDetailHero from "@/components/activities/ActivityDetailHero";
import ActivityDetailOverview from "@/components/activities/ActivityDetailOverview";
import ActivityHighlightsSection from "@/components/activities/ActivityHighlightsSection";
import ActivitySessionsSection from "@/components/activities/ActivitySessionsSection";
import { fetchActivityById, fetchActivitySchedules } from "@/services/activityService";
import { useParams } from "react-router-dom";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const bookingRef = useRef(null);
  const [activity, setActivity] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [activityData, schedulesData] = await Promise.all([
          fetchActivityById(id),
          fetchActivitySchedules(id),
        ]);

        if (!isMounted) return;
        setActivity(activityData);
        setSchedules(schedulesData);
      } catch {
        if (isMounted) {
          setActivity(null);
          setSchedules([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const availableSchedules = useMemo(
    () =>
      schedules.filter(
        (schedule) => schedule.status !== "cancelled" && schedule.availableSeats > 0
      ),
    [schedules]
  );

  const fullSchedules = useMemo(
    () =>
      schedules.filter(
        (schedule) => schedule.status === "cancelled" || schedule.availableSeats <= 0
      ),
    [schedules]
  );

  const handleBookSchedule = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    bookingRef.current?.selectActivity(id, scheduleId);
  };

  if (isLoading) {
    return (
      <section className="px-4 py-24 text-center text-sm text-muted-foreground">
        Loading activity...
      </section>
    );
  }

  if (!activity) {
    return (
      <section className="px-4 py-24 text-center text-sm text-muted-foreground">
        Activity not found.
      </section>
    );
  }

  return (
    <div className="text-foreground antialiased overflow-x-hidden transition-colors duration-300">
      <ActivityDetailHero activity={activity} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <ActivityDetailOverview activity={activity} />
        <ActivityHighlightsSection highlights={activity.highlights} />

        <ActivitySessionsSection
          title="Available Sessions"
          subtitle="Only available sessions can be booked. Full or closed sessions stay visible so guests understand what is still open."
          schedules={availableSchedules}
          emptyState="No available sessions right now. Guests can still review the activity details below."
          onBook={handleBookSchedule}
        />

        {fullSchedules.length ? (
          <ActivitySessionsSection
            title="Filled Or Closed Sessions"
            schedules={fullSchedules}
            onBook={handleBookSchedule}
          />
        ) : null}
      </section>

      <ActivityBooking
        ref={bookingRef}
        activities={[activity]}
        initialActivityId={activity.id}
        initialScheduleId={selectedScheduleId}
      />
    </div>
  );
}
