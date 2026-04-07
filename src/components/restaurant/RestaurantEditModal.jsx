import { useEffect, useMemo, useState } from "react";
import { Clock, X, UtensilsCrossed } from "lucide-react";
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";

const createDefaultDraft = () => {
  return {
    bookingMode: "table_only",
    date: "",
    time: "",
    guests: "2",
    selectedTable: "",
    roomNumber: "",
    paymentMethod: "cash",
  };
};

const buildInitialDraft = (initialBooking) => ({
  ...createDefaultDraft(),
  ...initialBooking,
});

export default function RestaurantEditModal({
  isOpen,
  booking,
  onClose,
  onConfirm,
}) {
  const [draft, setDraft] = useState(() => buildInitialDraft(booking));
  const [availableTables, setAvailableTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [activeStay, setActiveStay] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();

  const shouldLoadTables = isOpen && 
    (draft.bookingMode === "table_only" || draft.bookingMode === "dine_in") &&
    draft.date && 
    draft.time && 
    draft.guests;

  useEffect(() => {
    if (!isAuthenticated || draft.bookingMode !== "room_service") {
      setActiveStay(null);
      return;
    }
    let cancelled = false;
    void axiosPrivate
      .get("/reservations/active-stay")
      .then((res) => {
        if (!cancelled) {
          setActiveStay(res?.data?.data?.stay ?? null);
          const rn = res?.data?.data?.stay?.roomNumber;
          if (rn != null && !draft.roomNumber) {
            setDraft(current => ({ ...current, roomNumber: String(rn) }));
          }
        }
      })
      .catch(() => {
        if (!cancelled) setActiveStay(null);
      });
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, draft.bookingMode, isAuthenticated]);

  useEffect(() => {
    if (!shouldLoadTables) {
      setAvailableTables([]);
      return;
    }

    const g = Number(draft.guests);
    if (!Number.isInteger(g) || g < 1) {
      setAvailableTables([]);
      return;
    }

    let cancelled = false;
    setTablesLoading(true);
    void axiosPrivate
      .get("/booking/available-tables", { 
        params: { 
          date: draft.date, 
          time: draft.time, 
          guests: g 
        } 
      })
      .then((res) => {
        if (!cancelled) {
          setAvailableTables(Array.isArray(res?.data?.data?.tables) ? res.data.data.tables : []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableTables([]);
          toast.error("Could not load available tables.");
        }
      })
      .finally(() => {
        if (!cancelled) setTablesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, shouldLoadTables, draft.date, draft.time, draft.guests]);

  useEffect(() => {
    if (!draft.selectedTable) return;
    const n = Number(draft.selectedTable);
    const stillThere = availableTables.some((t) => Number(t.number) === n);
    if (!stillThere) {
      setDraft(current => ({ ...current, selectedTable: "" }));
    }
  }, [availableTables, draft.selectedTable]);

  useEffect(() => {
    if (draft.bookingMode === "room_service") {
      setDraft(current => ({ ...current, selectedTable: "" }));
    }
  }, [draft.bookingMode]);

  useEffect(() => {
    if (draft.bookingMode === "table_only") {
      setDraft(current => ({ ...current, paymentMethod: "cash" }));
    }
  }, [draft.bookingMode]);

  const handleChange = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleConfirm = () => {
    // Validation
    if (!draft.date) {
      toast.info("Please select a date.");
      return;
    }

    if (!draft.time) {
      toast.info("Please select a time.");
      return;
    }

    const guestCount = Number(draft.guests);
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      toast.info("Please enter a valid number of guests.");
      return;
    }

    if (draft.bookingMode === "table_only" || draft.bookingMode === "dine_in") {
      if (!draft.selectedTable) {
        toast.info("Please select a table.");
        return;
      }

      if (availableTables.length === 0) {
        toast.info("No tables available for this date, time, and party size.");
        return;
      }

      const tableNum = Number(draft.selectedTable);
      if (!availableTables.some((t) => Number(t.number) === tableNum)) {
        toast.info("That table is no longer available - pick again from the list.");
        return;
      }
    }

    if (draft.bookingMode === "room_service" && !draft.roomNumber) {
      toast.info("Please enter a room number for room service.");
      return;
    }

    onConfirm?.({
      ...draft,
      guests: guestCount,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  const bookingModes = [
    { value: "table_only", label: "Table only (pay on arrival)" },
    { value: "dine_in", label: "Dine in - food at your table" },
    { value: "room_service", label: "Room service" },
  ];

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
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
            Edit Restaurant Booking
          </p>
          <h3 className="mt-2 text-2xl font-header font-bold text-foreground">
            {draft.bookingMode === "room_service" ? "Room Service" : "Table Reservation"}
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
          {/* Booking Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Booking Type*</label>
            <Select value={draft.bookingMode} onValueChange={(value) => handleChange("bookingMode", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose booking type" />
              </SelectTrigger>
              <SelectContent>
                {bookingModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Date*</label>
            <Input
              type="date"
              value={draft.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="h-12 rounded-xl"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Time*</label>
            <Select value={draft.time} onValueChange={(value) => handleChange("time", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Number of Guests*</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={draft.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Table Selection (for table_only and dine_in) */}
          {(draft.bookingMode === "table_only" || draft.bookingMode === "dine_in") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Table Number*</label>
              <Select 
                value={draft.selectedTable} 
                onValueChange={(value) => handleChange("selectedTable", value)}
                disabled={tablesLoading || availableTables.length === 0}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue 
                    placeholder={tablesLoading ? "Loading tables..." : "Choose a table"} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table.number} value={String(table.number)}>
                      Table {table.number} (Seats: {table.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTables.length === 0 && draft.date && draft.time && draft.guests && (
                <p className="text-sm text-amber-600">
                  No tables available for this date, time, and party size.
                </p>
              )}
            </div>
          )}

          {/* Room Number (for room service) */}
          {draft.bookingMode === "room_service" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Room Number*</label>
              <Input
                type="text"
                value={draft.roomNumber}
                onChange={(e) => handleChange("roomNumber", e.target.value)}
                placeholder="Enter room number"
                className="h-12 rounded-xl"
              />
              {activeStay && (
                <p className="text-sm text-muted-foreground">
                  Current stay: Room {activeStay.roomNumber}
                </p>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Payment Method*</label>
            <Select 
              value={draft.paymentMethod} 
              onValueChange={(value) => handleChange("paymentMethod", value)}
              disabled={draft.bookingMode === "table_only"}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
            {draft.bookingMode === "table_only" && (
              <p className="text-sm text-muted-foreground">
                Table only bookings are cash payment only.
              </p>
            )}
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Special Requests (Optional)</label>
            <Textarea
              value={draft.specialRequests || ""}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              placeholder="Any special requirements or dietary restrictions..."
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>
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
