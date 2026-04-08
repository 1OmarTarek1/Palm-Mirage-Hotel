import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, Clock, Phone, Trash2, Edit3, AlertTriangle } from "lucide-react";
import ActivityEditModal from "@/components/activities/ActivityEditModal";
import { updatePendingActivityBooking } from "@/store/slices/cartSlice";

const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: "Pay on Arrival",
    card: "Card Payment"
  };
  return methods[method] || method;
};

export default function PendingActivityBookingCard({ booking, onRemove, conflict }) {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const calculateTotal = () => {
    return (booking.price || 0) * (booking.guests || 1);
  };

  const handleEditBooking = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking) => {
    dispatch(updatePendingActivityBooking({
      id: booking.id,
      updates: updatedBooking
    }));
    setIsEditModalOpen(false);
  };

  return (
    <div className={`group overflow-hidden rounded-[30px] border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
      conflict
        ? "border-destructive/60 bg-destructive/[0.03]"
        : "border-border bg-card"
    }`}>
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:h-auto lg:w-[250px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          
          <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
              Activity
            </span>
          </div>

          {booking.activityImage ? (
            <img
              src={booking.activityImage}
              alt={booking.activityTitle || "Activity"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Activity className="h-10 w-10 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-header text-2xl font-bold leading-tight text-foreground">
                {booking.activityTitle || "Activity Booking"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {booking.notes || "A relaxing and enjoyable activity"}
              </p>
            </div>
            
            <div className="flex shrink-0 items-center gap-2 self-start">
              <Button
                type="button"
                variant="light"
                size="icon"
                onClick={handleEditBooking}
                className="h-10 w-10 border-primary/20 bg-primary/5 text-primary transition-colors hover:border-primary/35 hover:bg-primary/15 hover:text-primary"
                aria-label="Edit booking"
                title="Edit booking"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="light"
                size="icon"
                onClick={onRemove}
                className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove item"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" /> {booking.scheduleDate}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" /> {booking.startTime} - {booking.endTime}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" /> {booking.guests} guest(s)
            </span>
            <span className="rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              ${booking.price?.toFixed(2) || "0.00"} / guest
            </span>
          </div>

          {conflict && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{conflict.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/70 pt-5">
            <div className="flex flex-col">
              <p className="text-xl font-bold text-foreground">
                ${calculateTotal().toFixed(2)}
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">
                Payment: {getPaymentMethodLabel(booking.paymentMethod)}
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Booking total
            </p>
          </div>
        </div>
      </div>
      
      <ActivityEditModal
        isOpen={isEditModalOpen}
        booking={booking}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleSaveBooking}
      />
    </div>
  );
}
