import { useEffect, useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { toast } from "react-toastify";

import AppModal from "@/components/common/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/rooms/booking/DatePicker";
import { fetchRoomAvailability } from "@/services/roomsApi";
import {
  calculateNights,
  formatBookingDate,
  formatBookingDateLabel,
} from "@/utils/roomBooking";

const createDefaultDraft = () => {
  return {
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    roomsCount: 1,
  };
};

const buildInitialDraft = (initialDraft) => ({
  ...createDefaultDraft(),
  ...initialDraft,
  checkInDate: formatBookingDate(initialDraft?.checkInDate) || "",
  checkOutDate: formatBookingDate(initialDraft?.checkOutDate) || "",
});

export default function RoomBookingModal({
  isOpen,
  room,
  initialDraft,
  onClose,
  onConfirm,
}) {
  const [draft, setDraft] = useState(() => buildInitialDraft(initialDraft));
  const [availability, setAvailability] = useState(null);
  const [availabilityRangeKey, setAvailabilityRangeKey] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const shouldLoadAvailability = isOpen && Boolean(room?.id);
  const selectedRangeKey =
    draft.checkInDate && draft.checkOutDate
      ? `${draft.checkInDate}_${draft.checkOutDate}`
      : "";

  useEffect(() => {
    if (!shouldLoadAvailability) return;

    const controller = new AbortController();
    const requestRangeKey =
      draft.checkInDate && draft.checkOutDate
        ? `${draft.checkInDate}_${draft.checkOutDate}`
        : "";

    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const response = await fetchRoomAvailability(
          room.id,
          draft.checkInDate && draft.checkOutDate
            ? {
                checkInDate: draft.checkInDate,
                checkOutDate: draft.checkOutDate,
                signal: controller.signal,
              }
            : {
                signal: controller.signal,
              }
        );
        setAvailability(response);
        setAvailabilityRangeKey(requestRangeKey);
      } catch (error) {
        if (controller.signal.aborted) return;
        setAvailability(null);
        setAvailabilityRangeKey("");
        toast.error(error?.response?.data?.message || "Failed to check room availability.");
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    };

    void loadAvailability();

    return () => controller.abort();
  }, [draft.checkInDate, draft.checkOutDate, shouldLoadAvailability, room?.id]);

  const nightCount = useMemo(
    () => calculateNights(draft.checkInDate, draft.checkOutDate),
    [draft.checkInDate, draft.checkOutDate]
  );

  const effectiveAvailability =
    shouldLoadAvailability &&
    (!selectedRangeKey || availabilityRangeKey === selectedRangeKey)
      ? availability
      : null;
  const availabilityStatus = effectiveAvailability?.isBookable ? "available" : "unavailable";
  const datePickerState = useMemo(
    () => ({
      checkIn: draft.checkInDate ? new Date(`${draft.checkInDate}T00:00:00`) : null,
      checkOut: draft.checkOutDate ? new Date(`${draft.checkOutDate}T00:00:00`) : null,
    }),
    [draft.checkInDate, draft.checkOutDate]
  );

  if (!isOpen || !room) return null;

  const handleChange = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleDatePickerState = (updater) => {
    const currentState = {
      checkIn: draft.checkInDate ? new Date(`${draft.checkInDate}T00:00:00`) : null,
      checkOut: draft.checkOutDate ? new Date(`${draft.checkOutDate}T00:00:00`) : null,
    };
    const nextState = typeof updater === "function" ? updater(currentState) : updater;

    setDraft((current) => ({
      ...current,
      checkInDate: nextState?.checkIn ? formatBookingDate(nextState.checkIn) : "",
      checkOutDate: nextState?.checkOut ? formatBookingDate(nextState.checkOut) : "",
    }));
  };

  const handleConfirm = () => {
    if (!draft.checkInDate || !draft.checkOutDate) {
      toast.info("Select check-in and check-out dates first.");
      return;
    }

    if (nightCount <= 0) {
      toast.info("Check-out must be after check-in.");
      return;
    }

    if (availabilityLoading) {
      toast.info("Checking room availability. Please wait a moment.");
      return;
    }

    if (!effectiveAvailability || availabilityRangeKey !== selectedRangeKey) {
      toast.info("Room availability has not been confirmed for these dates yet.");
      return;
    }

    if (!effectiveAvailability?.isBookable) {
      toast.info("This room is not available for the selected dates.");
      return;
    }

    onConfirm?.({
      ...draft,
      nights: nightCount,
      availabilityStatus,
      availabilityCheckedAt: new Date().toISOString(),
      bookedRanges: effectiveAvailability?.bookedRanges || [],
    });
  };

  return (
    <AppModal
      open={isOpen}
      onClose={onClose}
      layout="card"
      zIndex={80}
      closeOnBackdrop={false}
      showTint
      tintClassName="bg-black/55 px-4 py-6 backdrop-blur-sm max-sm:p-0"
      maxWidthClassName="max-w-[620px] sm:max-w-[620px]"
      maxHeightClassName="sm:max-h-[min(90dvh,90%)]"
      panelClassName="rounded-none border border-border bg-card shadow-2xl max-sm:min-h-0 max-sm:flex-1 max-sm:max-h-full sm:rounded-[28px]"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Select Stay Dates
            </p>
            <h3 className="mt-2 text-2xl font-header font-bold text-foreground">{room.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close date selection"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-border bg-muted/20 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Stay dates
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {draft.checkInDate ? formatBookingDateLabel(draft.checkInDate) : "Select check-in"}
                {draft.checkOutDate ? ` - ${formatBookingDateLabel(draft.checkOutDate)}` : " - Select check-out"}
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-card shadow-sm">
              <DatePicker
                key={`${draft.checkInDate || "none"}-${draft.checkOutDate || "none"}`}
                checkIn={datePickerState.checkIn}
                checkOut={datePickerState.checkOut}
                setBookingState={handleDatePickerState}
                setActivePopover={() => {}}
                bookedRanges={effectiveAvailability?.bookedRanges || []}
                onBlockedDateClick={() => toast.info("This date is already booked. Please choose another range.")}
                onInvalidRangeSelection={() => toast.info("This stay overlaps booked dates or the next checkout day is unavailable. Please choose another range.")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Adults
                </span>
                <Input
                  type="number"
                  min="1"
                  max={room.guests || 10}
                  value={draft.adults}
                  onChange={(event) => handleChange("adults", event.target.value)}
                  className="h-12 border-border bg-background"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Children
                </span>
                <Input
                  type="number"
                  min="0"
                  value={draft.children}
                  onChange={(event) => handleChange("children", event.target.value)}
                  className="h-12 border-border bg-background"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Rooms
                </span>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={draft.roomsCount}
                  onChange={(event) => handleChange("roomsCount", event.target.value)}
                  className="h-12 border-border bg-background"
                />
              </label>
            </div>

            <div className="rounded-[24px] border border-border bg-muted/25 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {draft.checkInDate ? formatBookingDateLabel(draft.checkInDate) : "Select check-in"}
                    {draft.checkOutDate ? ` - ${formatBookingDateLabel(draft.checkOutDate)}` : " - Select check-out"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {nightCount > 0 ? `${nightCount} night${nightCount > 1 ? "s" : ""}` : "Choose a valid date range"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:flex-row sm:justify-end sm:pb-5">
        <Button type="button" variant="palmSecondary" className="h-11 px-6" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="palmPrimary" className="h-11 px-6" onClick={handleConfirm}>
          Save Stay Dates
        </Button>
      </div>
    </AppModal>
  );
}
