import { useEffect, useMemo, useRef, useState } from "react";
import ActivityBooking from "@/components/activities/ActivityBooking";
import ActivityDetailHero from "@/components/activities/ActivityDetailHero";
import ActivityDetailOverview from "@/components/activities/ActivityDetailOverview";
import ActivityHighlightsSection from "@/components/activities/ActivityHighlightsSection";
import ActivitySessionsSection from "@/components/activities/ActivitySessionsSection";
import { ActivityDetailPageSkeleton } from "@/components/activities/loading/ActivitiesPageSkeleton";
import {
  useActivityDetailQuery,
  useActivitySchedulesQuery,
} from "@/hooks/useCatalogQueries";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPendingActivityBookings } from "@/store/slices/cartSlice";
import { selectActiveActivityBookings } from "@/services/activityBookings/activityBookingsSlice";
import { resolveActivityScheduleConflict } from "@/utils/activityBookingConflicts";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const bookingRef = useRef(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const activeActivityBookings = useSelector(selectActiveActivityBookings);

  const { data: activity, isLoading: activityLoading } = useActivityDetailQuery(id);
  const { data: schedules = [], isLoading: schedulesLoading } = useActivitySchedulesQuery(id);

  const isLoading = activityLoading || schedulesLoading;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedScheduleId("");
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

  const getScheduleConflict = (schedule) =>
    resolveActivityScheduleConflict({
      scheduleId: schedule?.id,
      activeActivityBookings,
      pendingActivityBookings,
    });

  if (isLoading) {
    return <ActivityDetailPageSkeleton />;
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
          getScheduleConflict={getScheduleConflict}
        />

        {fullSchedules.length ? (
          <ActivitySessionsSection
            title="Filled Or Closed Sessions"
            schedules={fullSchedules}
            onBook={handleBookSchedule}
            getScheduleConflict={getScheduleConflict}
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
