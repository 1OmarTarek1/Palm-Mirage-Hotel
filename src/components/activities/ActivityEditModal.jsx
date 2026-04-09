import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CalendarDays, X, Activity } from "lucide-react";
import { toast } from "react-toastify";

import AppModal from "@/components/common/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchActivitySchedules } from "@/services/activityService";
import {
  selectPendingActivityBookings,
} from "@/store/slices/cartSlice";
import { selectActiveActivityBookings } from "@/services/activityBookings/activityBookingsSlice";
import { resolveActivityScheduleConflict } from "@/utils/activityBookingConflicts";

const createDefaultDraft = () => {
  return {
    activityId: "",
    scheduleId: "",
    guests: "2",
    contactPhone: "",
    notes: "",
    paymentMethod: "cash",
  };
};

const buildInitialDraft = (initialBooking) => ({
  ...createDefaultDraft(),
  ...initialBooking,
});

export default function ActivityEditModal({
  isOpen,
  booking,
  onClose,
  onConfirm,
}) {
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const activeActivityBookings = useSelector(selectActiveActivityBookings);
  const [draft, setDraft] = useState(() => buildInitialDraft(booking));
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(buildInitialDraft(booking));
    }
  }, [isOpen, booking]);

  useEffect(() => {
    if (!isOpen) return;
    
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSchedulesLoading(true);
    
    void fetchActivitySchedules()
      .then((apiSchedules) => {
        if (!cancelled) {
          setSchedules(apiSchedules.filter((schedule) => schedule.status !== "cancelled"));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSchedules([]);
          toast.error("Could not load activity schedules.");
        }
      })
      .finally(() => {
        if (!cancelled) setSchedulesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!draft.scheduleId) return;
    
    const selectedSchedule = schedules.find((schedule) => schedule.id === draft.scheduleId);
    if (selectedSchedule && !draft.activityId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(current => ({ ...current, activityId: selectedSchedule.activityId }));
    }
  }, [draft.scheduleId, schedules, draft.activityId]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) =>
      draft.activityId ? schedule.activityId === draft.activityId : true
    );
  }, [schedules, draft.activityId]);

  const selectedScheduleData = useMemo(
    () => filteredSchedules.find((schedule) => schedule.id === draft.scheduleId) ?? null,
    [filteredSchedules, draft.scheduleId]
  );

  const getScheduleConflict = (scheduleId) =>
    resolveActivityScheduleConflict({
      scheduleId,
      activeActivityBookings,
      pendingActivityBookings,
      excludePendingBookingId: booking?.id,
    });

  const totalPrice = useMemo(() => {
    if (!selectedScheduleData) return 0;

    if (selectedScheduleData.pricingType === "per_group") {
      return selectedScheduleData.resolvedPrice;
    }

    return selectedScheduleData.resolvedPrice * Number(draft.guests || 0);
  }, [selectedScheduleData, draft.guests]);

  const scheduleConflict = useMemo(
    () =>
      resolveActivityScheduleConflict({
        scheduleId: draft.scheduleId,
        activeActivityBookings,
        pendingActivityBookings,
        excludePendingBookingId: booking?.id,
      }),
    [draft.scheduleId, activeActivityBookings, pendingActivityBookings, booking?.id]
  );

  const handleChange = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleConfirm = () => {
    // Validation
    if (!draft.activityId) {
      toast.info("Please select an activity.");
      return;
    }

    if (!draft.scheduleId) {
      toast.info("Please select a schedule.");
      return;
    }

    const guestCount = Number(draft.guests);
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      toast.info("Please enter a valid number of guests.");
      return;
    }

    if (!selectedScheduleData) {
      toast.info("Selected schedule not found.");
      return;
    }

    if (scheduleConflict) {
      toast.info(scheduleConflict.message);
      return;
    }

    if (guestCount > Number(selectedScheduleData.availableSeats || 0)) {
      toast.info("Selected guests exceed the available seats for this session.");
      return;
    }

    if (!draft.contactPhone.trim()) {
      toast.info("Please provide a contact phone number.");
      return;
    }

    const phonePattern = /^[\d\s()+-]+$/;
    const normalizedPhone = draft.contactPhone.trim();
    const compactPhone = normalizedPhone.replace(/[^\d+]/g, "");
    
    if (!phonePattern.test(normalizedPhone) || compactPhone.replace(/\D/g, "").length < 7) {
      toast.info("Please provide a valid phone number.");
      return;
    }

    onConfirm?.({
      ...draft,
      activityId: selectedScheduleData.activityId,
      activityTitle: selectedScheduleData.activityTitle,
      activityImage: selectedScheduleData.activityImage || draft.activityImage || "",
      scheduleId: selectedScheduleData.id,
      scheduleDate: selectedScheduleData.date,
      startTime: selectedScheduleData.startTime,
      endTime: selectedScheduleData.endTime,
      guests: guestCount,
      contactPhone: normalizedPhone,
      notes: draft.notes.trim(),
      paymentMethod: draft.paymentMethod,
      price: selectedScheduleData.resolvedPrice || 0,
      totalPrice: totalPrice,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <AppModal
      open={isOpen}
      onClose={onClose}
      layout="card"
      zIndex={80}
      closeOnBackdrop={true}
      showTint
      tintClassName="bg-black/55 px-4 py-6 backdrop-blur-sm max-sm:p-0"
      maxWidthClassName="max-w-[620px] sm:max-w-[620px]"
      maxHeightClassName="sm:max-h-[min(90dvh,90%)]"
      panelClassName="rounded-none border border-border bg-card shadow-2xl max-sm:min-h-0 max-sm:flex-1 max-sm:max-h-full sm:rounded-[28px]"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Edit Activity Booking
          </p>
          <h3 className="mt-2 text-2xl font-header font-bold text-foreground">
            Activity Reservation
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close booking edit"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="space-y-6">
          {/* Activity Selection */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Activity</span>
            <Select value={draft.activityId} onValueChange={(value) => handleChange("activityId", value)}>
              <SelectTrigger className="h-12 border-border bg-background rounded-xl">
                <SelectValue placeholder="Choose an activity" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(schedules.map(s => s.activityId))).map((activityId) => {
                  const schedule = schedules.find(s => s.activityId === activityId);
                  return (
                    <SelectItem key={activityId} value={activityId}>
                      {schedule?.activityTitle || activityId}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </label>

          {/* Schedule Selection */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Schedule</span>
            <Select 
              value={draft.scheduleId} 
              onValueChange={(value) => handleChange("scheduleId", value)}
              disabled={!schedulesLoading && filteredSchedules.length === 0 && !draft.scheduleId}
            >
              <SelectTrigger className="h-12 border-border bg-background rounded-xl">
                <SelectValue 
                  placeholder={schedulesLoading ? "Loading schedules..." : "Choose a schedule"} 
                />
              </SelectTrigger>
              <SelectContent>
                {filteredSchedules.map((schedule) => {
                  const conflict = getScheduleConflict(schedule.id);
                  return (
                    <SelectItem
                      key={schedule.id}
                      value={schedule.id}
                      disabled={Boolean(conflict)}
                    >
                      {schedule.date} - {schedule.startTime} to {schedule.endTime}
                      {conflict?.type === "existing_booking" ? " - already booked" : ""}
                      {conflict?.type === "pending_cart" ? " - in your cart" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {filteredSchedules.length === 0 && !schedulesLoading && draft.activityId && (
              <p className="text-sm text-amber-600 mt-2">
                No schedules available for this activity.
              </p>
            )}
          </label>

          {/* Selected Schedule Info */}
          {selectedScheduleData && (
            <div className="rounded-[24px] border border-border bg-muted/25 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{selectedScheduleData.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{selectedScheduleData.startTime} - {selectedScheduleData.endTime}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Available Seats</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{selectedScheduleData.availableSeats}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Price</p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    ${selectedScheduleData.resolvedPrice}
                    {selectedScheduleData.pricingType === "per_group" ? " (per group)" : " (per person)"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {scheduleConflict ? (
            <div className="rounded-[20px] border border-destructive/40 bg-destructive/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
                Needs Update
              </p>
              <p className="mt-2 text-sm text-foreground">
                {scheduleConflict.message} Choose another session before saving this booking.
              </p>
            </div>
          ) : null}

          {/* Guests */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Number of Guests</span>
            <Input
              type="number"
              min="1"
              max={selectedScheduleData?.availableSeats || 20}
              value={draft.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
              className="h-12 border-border bg-background rounded-xl"
            />
            {selectedScheduleData && (
              <p className="text-sm text-muted-foreground mt-2">
                Maximum {selectedScheduleData.availableSeats} guests available.
              </p>
            )}
          </label>

          {/* Contact Phone */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact Phone</span>
            <Input
              type="tel"
              value={draft.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              placeholder="+20 1xx xxxx xxxx"
              className="h-12 border-border bg-background rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Include country code for international numbers
            </p>
          </label>

          {/* Special Notes */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Special Requirements (Optional)</span>
            <Textarea
              value={draft.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any special requirements or notes..."
              className="min-h-[100px] border-border bg-background rounded-xl resize-none"
            />
          </label>

        </div>
      </div>

      {/* Total Price - outside scroll, above footer */}
      {selectedScheduleData && (
        <div className="mx-6 mb-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Total Price</p>
              <p className="text-xs text-muted-foreground">
                {draft.guests} guests × ${selectedScheduleData.resolvedPrice}
                {selectedScheduleData.pricingType === "per_group" ? " (group rate)" : " (per person)"}
              </p>
            </div>
            <p className="text-2xl font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:flex-row sm:justify-end sm:pb-5">
        <Button
          type="button"
          variant="palmSecondary"
          onClick={onClose}
          className="h-11 px-6"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="palmPrimary"
          onClick={handleConfirm}
          disabled={Boolean(scheduleConflict)}
          className="h-11 px-6"
        >
          Save Changes
        </Button>
      </div>
    </AppModal>
  );
}
