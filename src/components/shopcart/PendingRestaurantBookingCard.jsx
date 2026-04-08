import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Users, Calendar, Clock, Trash2, Edit3, AlertTriangle } from "lucide-react";
import RestaurantEditModal from "@/components/restaurant/RestaurantEditModal";
import {
  getRestaurantBookingLocationLabel,
  getRestaurantBookingModeLabel,
  isRestaurantTableMode,
} from "@/components/profile/profileUtils";
import { updatePendingRestaurantBooking } from "@/store/slices/cartSlice";

export default function PendingRestaurantBookingCard({ booking, onRemove, conflict }) {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const calculateTotal = () => {
    if (!booking.lineItems || booking.lineItems.length === 0) return 0;
    return booking.lineItems.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);
  };

  const handleEditBooking = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking) => {
    dispatch(updatePendingRestaurantBooking({
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
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:h-auto lg:w-[250px] bg-muted/40 p-4 flex flex-col justify-between">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          <div className="relative z-20 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
              {getRestaurantBookingModeLabel(booking.bookingMode)}
            </span>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center mt-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3 shadow-inner">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
            </div>
            
            {booking.bookingMode === "room_service" && booking.roomNumber && (
              <span className="rounded-full bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">
                Room {booking.roomNumber}
              </span>
            )}
            
            {isRestaurantTableMode(booking.bookingMode) && booking.number && (
              <span className="rounded-full bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">
                Table {booking.number}
              </span>
            )}

            {booking.bookingMode === "pickup" && (
              <span className="rounded-full bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">
                Pickup
              </span>
            )}
          </div>
          
          <div className="relative z-20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              {booking.lineItems?.length || 0} item(s)
            </span>
          </div>
        </div>
        
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-header text-2xl font-bold leading-tight text-foreground">
                Restaurant Booking
              </h3>
              
              {booking.lineItems && booking.lineItems.length > 0 ? (
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-1.5 text-xs font-medium text-foreground w-fit">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-primary" /> {booking.lineItems.length} Menus
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  {booking.bookingMode === "table_only"
                    ? "Table reservation only (no food items pre-ordered)."
                    : "No food items included yet."}
                </p>
              )}
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
              <Calendar className="h-3.5 w-3.5 text-primary" /> {booking.date}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" /> {booking.time}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" /> {booking.guests} guest(s)
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs font-medium text-foreground">
              {getRestaurantBookingLocationLabel(booking)}
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
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">
                Payment at checkout
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Booking total
            </p>
          </div>
        </div>
      </div>
      
      <RestaurantEditModal
        isOpen={isEditModalOpen}
        booking={booking}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleSaveBooking}
      />
    </div>
  );
}
