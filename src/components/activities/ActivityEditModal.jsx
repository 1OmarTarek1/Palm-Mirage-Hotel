import { useEffect, useMemo, useState } from "react";
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
  const [draft, setDraft] = useState(() => buildInitialDraft(booking));
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    let cancelled = false;
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

  const totalPrice = useMemo(() => {
    if (!selectedScheduleData) return 0;

    if (selectedScheduleData.pricingType === "per_group") {
      return selectedScheduleData.resolvedPrice;
    }

    return selectedScheduleData.resolvedPrice * Number(draft.guests || 0);
  }, [selectedScheduleData, draft.guests]);

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
      scheduleId: selectedScheduleData.id,
      scheduleDate: selectedScheduleData.date,
      startTime: selectedScheduleData.startTime,
      endTime: selectedScheduleData.endTime,
      guests: guestCount,
      contactPhone: normalizedPhone,
      notes: draft.notes.trim(),
      paymentMethod: draft.paymentMethod,
      price: selectedScheduleData.price || 0,
      totalPrice: totalPrice,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  const phonePattern = /^[\d\s()+-]+$/;

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
  ];

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

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Activity Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Activity*</label>
            <Select value={draft.activityId} onValueChange={(value) => handleChange("activityId", value)}>
              <SelectTrigger className="h-12 rounded-xl">
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
          </div>

          {/* Schedule Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Schedule*</label>
            <Select 
              value={draft.scheduleId} 
              onValueChange={(value) => handleChange("scheduleId", value)}
              disabled={schedulesLoading || filteredSchedules.length === 0}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue 
                  placeholder={schedulesLoading ? "Loading schedules..." : "Choose a schedule"} 
                />
              </SelectTrigger>
              <SelectContent>
                {filteredSchedules.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.date} - {schedule.startTime} to {schedule.endTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredSchedules.length === 0 && draft.activityId && (
              <p className="text-sm text-amber-600">
                No schedules available for this activity.
              </p>
            )}
          </div>

          {/* Selected Schedule Info */}
          {selectedScheduleData && (
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">{selectedScheduleData.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold">{selectedScheduleData.startTime} - {selectedScheduleData.endTime}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Available Seats</p>
                  <p className="text-sm font-semibold">{selectedScheduleData.availableSeats}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Price</p>
                  <p className="text-sm font-semibold">
                    ${selectedScheduleData.resolvedPrice}
                    {selectedScheduleData.pricingType === "per_group" ? " (per group)" : " (per person)"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Number of Guests*</label>
            <Input
              type="number"
              min="1"
              max={selectedScheduleData?.availableSeats || 20}
              value={draft.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
              className="h-12 rounded-xl"
            />
            {selectedScheduleData && (
              <p className="text-sm text-muted-foreground">
                Maximum {selectedScheduleData.availableSeats} guests available.
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Contact Phone*</label>
            <Input
              type="tel"
              value={draft.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              placeholder="+20 1xx xxxx xxxx"
              className="h-12 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Include country code for international numbers
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Payment Method*</label>
            <Select value={draft.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Special Requirements (Optional)</label>
            <Textarea
              value={draft.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any special requirements or notes..."
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>

          {/* Total Price */}
          {selectedScheduleData && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
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
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-3 border-t border-border px-6 py-5">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-12 rounded-xl px-8"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          className="h-12 rounded-xl px-8"
        >
          Save Changes
        </Button>
      </div>
    </AppModal>
  );
}
