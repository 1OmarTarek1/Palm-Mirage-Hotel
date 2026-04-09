const blockingActivityStatuses = new Set(["pending", "awaiting_payment", "confirmed", "completed"]);

const normalizeScheduleId = (value) => String(value ?? "");

export const findBlockingActivityBooking = ({
  scheduleId,
  activeActivityBookings = [],
}) => {
  const normalizedScheduleId = normalizeScheduleId(scheduleId);
  if (!normalizedScheduleId) return null;

  return (
    activeActivityBookings.find((booking) => {
      if (!blockingActivityStatuses.has(booking?.status)) return false;
      const existingScheduleId = normalizeScheduleId(
        booking?.schedule?.id || booking?.schedule?._id || booking?.schedule
      );
      return existingScheduleId === normalizedScheduleId;
    }) || null
  );
};

export const findPendingActivityCartConflict = ({
  scheduleId,
  pendingActivityBookings = [],
  excludePendingBookingId = null,
}) => {
  const normalizedScheduleId = normalizeScheduleId(scheduleId);
  const normalizedExcludeId = normalizeScheduleId(excludePendingBookingId);
  if (!normalizedScheduleId) return null;

  return (
    pendingActivityBookings.find((booking) => {
      if (normalizedExcludeId && normalizeScheduleId(booking?.id) === normalizedExcludeId) {
        return false;
      }
      return normalizeScheduleId(booking?.scheduleId) === normalizedScheduleId;
    }) || null
  );
};

export const resolveActivityScheduleConflict = ({
  scheduleId,
  activeActivityBookings = [],
  pendingActivityBookings = [],
  excludePendingBookingId = null,
}) => {
  const existingBooking = findBlockingActivityBooking({
    scheduleId,
    activeActivityBookings,
  });

  if (existingBooking) {
    return {
      type: "existing_booking",
      booking: existingBooking,
      message: "You already booked this activity session from your account.",
    };
  }

  const pendingBooking = findPendingActivityCartConflict({
    scheduleId,
    pendingActivityBookings,
    excludePendingBookingId,
  });

  if (pendingBooking) {
    return {
      type: "pending_cart",
      booking: pendingBooking,
      message: "This activity session is already in your cart.",
    };
  }

  return null;
};
