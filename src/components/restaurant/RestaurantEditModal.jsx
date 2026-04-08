import { useEffect, useMemo, useState } from "react";
import { Clock, X, UtensilsCrossed, Trash2 } from "lucide-react";
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
    selectedTable: "",
    roomNumber: "",
    paymentMethod: "cash",
    lineItems: [],
  };
};

const normalizeTimeValue = (value) => {
  if (!value) return "";
  const raw = String(value).trim();

  const hhmmMatch = raw.match(/^(\d{2}):(\d{2})/);
  if (hhmmMatch) {
    return `${hhmmMatch[1]}:${hhmmMatch[2]}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return raw;
};

const buildInitialDraft = (initialBooking) => ({
  ...createDefaultDraft(),
  ...initialBooking,
  time: normalizeTimeValue(initialBooking?.time),
  selectedTable: String(initialBooking?.selectedTable || initialBooking?.number || ""),
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

  useEffect(() => {
    if (isOpen) {
      setDraft(buildInitialDraft(booking));
    }
  }, [isOpen, booking]);

  const shouldLoadTables = isOpen &&  
    (draft.bookingMode === "table_only" || draft.bookingMode === "dine_in") &&
    draft.date && 
    draft.time;

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

    let cancelled = false;
    setTablesLoading(true);
    void axiosPrivate
      .get("/booking/available-tables", { 
        params: { 
          date: draft.date, 
          time: draft.time
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
  }, [axiosPrivate, shouldLoadTables, draft.date, draft.time]);



  useEffect(() => {
    if (draft.bookingMode === "room_service") {
      setDraft(current => ({ ...current, selectedTable: "" }));
    }
  }, [draft.bookingMode]);

  useEffect(() => {
    if (draft.bookingMode === "pickup") {
      setDraft(current => ({ ...current, selectedTable: "", roomNumber: "" }));
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

  const calculateTotal = () => {
    return (draft.lineItems || []).reduce(
      (total, item) => total + Number(item.price) * item.qty,
      0
    );
  };

  const handleUpdateItemQty = (index, newQty) => {
    if (newQty < 1) return;
    const newItems = [...(draft.lineItems || [])];
    newItems[index] = { ...newItems[index], qty: newQty };
    handleChange("lineItems", newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = (draft.lineItems || []).filter((_, i) => i !== index);
    handleChange("lineItems", newItems);
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

    if (
      (draft.bookingMode === "dine_in" ||
        draft.bookingMode === "room_service" ||
        draft.bookingMode === "pickup") &&
      (!Array.isArray(draft.lineItems) || draft.lineItems.length === 0)
    ) {
      toast.info("Please keep at least one dish in the order.");
      return;
    }

    onConfirm?.({
      ...draft,
      number:
        draft.bookingMode === "table_only" || draft.bookingMode === "dine_in"
          ? Number(draft.selectedTable)
          : undefined,
      guests:
        draft.bookingMode === "table_only" || draft.bookingMode === "dine_in"
          ? Number(availableTables.find((t) => Number(t.number) === Number(draft.selectedTable))?.chairs ?? draft.guests ?? 1)
          : Number(draft.guests || 1),
      updatedAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  const bookingModes = [
    { value: "table_only", label: "Table only (pay on arrival)" },
    { value: "dine_in", label: "Dine in - food at your table" },
    { value: "room_service", label: "Room service" },
    { value: "pickup", label: "Pickup - collect from restaurant" },
  ];

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];
  const selectableTimeSlots = timeSlots.includes(draft.time) || !draft.time
    ? timeSlots
    : [draft.time, ...timeSlots];

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
            Edit Restaurant Booking
          </p>
          <h3 className="mt-2 text-2xl font-header font-bold text-foreground">
            {draft.bookingMode === "room_service"
              ? "Room Service"
              : draft.bookingMode === "pickup"
                ? "Pickup Order"
                : "Table Reservation"}
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
          {/* Booking Mode */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Booking Type</span>
            <Select value={draft.bookingMode} onValueChange={(value) => handleChange("bookingMode", value)}>
              <SelectTrigger className="h-12 border-border bg-background rounded-xl">
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
          </label>

          {/* Date */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Date</span>
            <Input
              type="date"
              value={draft.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="h-12 border-border bg-background rounded-xl"
              min={new Date().toISOString().split('T')[0]}
            />
          </label>

          {/* Time */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Time</span>
            <Select value={draft.time} onValueChange={(value) => handleChange("time", value)}>
              <SelectTrigger className="h-12 border-border bg-background rounded-xl">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {selectableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          {/* Table Selection (for table_only and dine_in) */}
          {(draft.bookingMode === "table_only" || draft.bookingMode === "dine_in") && (
            <label className="space-y-2 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Table Number</span>
              <Select 
                value={draft.selectedTable} 
                onValueChange={(value) => handleChange("selectedTable", value)}
                disabled={availableTables.length === 0 && !draft.selectedTable && !tablesLoading}
              >
                <SelectTrigger className="h-12 border-border bg-background rounded-xl">
                  <SelectValue 
                    placeholder={tablesLoading ? "Loading tables..." : "Choose a table"} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {draft.selectedTable && !availableTables.some(t => String(t.number) === String(draft.selectedTable)) && (
                    <SelectItem value={String(draft.selectedTable)}>
                      Table {draft.selectedTable} {draft.guests ? `(Seats: ${draft.guests})` : ""}
                    </SelectItem>
                  )}
                  {availableTables.map((table) => (
                    <SelectItem key={table.number} value={String(table.number)}>
                      Table {table.number} (Seats: {table.chairs})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTables.length === 0 && !tablesLoading && draft.date && draft.time && !draft.selectedTable && (
                <p className="text-sm text-amber-600 mt-2">
                  No tables available for this date and time.
                </p>
              )}
            </label>
          )}

          {/* Room Number (for room service) */}
          {draft.bookingMode === "room_service" && (
            <label className="space-y-2 block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Room Number</span>
              <Input
                type="text"
                value={draft.roomNumber}
                onChange={(e) => handleChange("roomNumber", e.target.value)}
                placeholder="Enter room number"
                className="h-12 border-border bg-background rounded-xl"
              />
              {activeStay && (
                <p className="text-sm text-muted-foreground mt-2">
                  Current stay: Room {activeStay.roomNumber}
                </p>
              )}
            </label>
          )}



          {/* Pre-ordered Items */}
          {draft.lineItems && draft.lineItems.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Pre-ordered Items</h4>
              <div className="space-y-3">
                {draft.lineItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                    <img 
                      src={item.image || "/assets/images/auth-bg.jpg"} 
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-primary font-bold text-sm">${Number(item.price).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-background border border-border rounded-lg overflow-hidden h-9">
                      <button 
                        type="button"
                        onClick={() => handleUpdateItemQty(index, item.qty - 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-muted/50"
                      >
                         - 
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                      <button 
                        type="button"
                        onClick={() => handleUpdateItemQty(index, item.qty + 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-muted/50"
                      >
                         + 
                      </button>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="shrink-0 h-9 w-9 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-lg ml-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Special Requests (Optional)</span>
            <Textarea
              value={draft.specialRequests || ""}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              placeholder="Any special requirements or dietary restrictions..."
              className="min-h-[100px] border-border bg-background rounded-xl resize-none"
            />
          </label>
        </div>
      </div>

      {/* Total Price - outside scroll, above footer */}
      {draft.lineItems && draft.lineItems.length > 0 && (
        <div className="mx-6 mb-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Total Food Price</p>
              <p className="text-xs text-muted-foreground">
                Based on {draft.lineItems.reduce((acc, it) => acc + it.qty, 0)} item(s)
              </p>
            </div>
            <p className="text-2xl font-bold text-primary">
              ${calculateTotal().toFixed(2)}
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
          className="h-11 px-6"
        >
          Save Changes
        </Button>
      </div>
    </AppModal>
  );
}
