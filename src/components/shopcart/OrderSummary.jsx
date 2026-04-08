import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Activity, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateCartItemTotal,
  formatBookingDateLabel,
  isCartItemReady,
} from "@/utils/roomBooking";

export default function OrderSummary({ cartItems, totalPrice, pendingTotals, hasConflicts = false, conflictList = [] }) {
  const navigate = useNavigate();
  const roomItems = cartItems.filter((item) => !item.type);
  const hasInvalidBookings = roomItems.some((item) => !isCartItemReady(item));
  
  const regularItems = cartItems.filter(item => !item.type);
  const restaurantItems = cartItems.filter(item => item.type === 'restaurant');
  const activityItems = cartItems.filter(item => item.type === 'activity');
  
  const hasAnyItems = cartItems.length > 0;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm lg:min-h-[calc(100vh-7rem)]">
        <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

        <div className="mt-5 flex-1 space-y-3">
          {/* Regular Room Items */}
          {regularItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0 pr-2">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBookingDateLabel(item.checkInDate)} - {formatBookingDateLabel(item.checkOutDate)}
                </p>
              </div>
              <span className="shrink-0 font-medium text-foreground">
                ${calculateCartItemTotal(item).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Restaurant Items */}
          {restaurantItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0 pr-2 flex items-center gap-2">
                <UtensilsCrossed className="h-3 w-3 text-primary" />
                <div>
                  <p className="truncate font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Restaurant Booking
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-medium text-foreground">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Activity Items */}
          {activityItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0 pr-2 flex items-center gap-2">
                <Activity className="h-3 w-3 text-primary" />
                <div>
                  <p className="truncate font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} guests
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-medium text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Pending Totals Summary */}
          {pendingTotals && (pendingTotals.restaurantTotal > 0 || pendingTotals.activityTotal > 0) && (
            <div className="border-t pt-3 space-y-2">
              {pendingTotals.restaurantTotal > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Restaurant Items</span>
                  <span>${pendingTotals.restaurantTotal.toFixed(2)}</span>
                </div>
              )}
              {pendingTotals.activityTotal > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Activity Items</span>
                  <span>${pendingTotals.activityTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
        </div>

        {/* Info Messages */}
        <div className="space-y-2">
          {regularItems.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
              Every room must have valid available dates before checkout can continue.
            </p>
          )}
          
          {(restaurantItems.length > 0 || activityItems.length > 0) && (
            <p className="text-[11px] text-muted-foreground">
              Restaurant and activity bookings will be processed together with your room reservation.
            </p>
          )}
        </div>

        {/* Conflict Summary */}
        {hasConflicts && conflictList.length > 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              {conflictList.length === 1 ? "1 issue needs your attention" : `${conflictList.length} issues need your attention`}
            </div>
            <ul className="space-y-1.5 pl-1">
              {conflictList.map((c, i) => (
                <li key={i} className="text-xs text-destructive flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>
                  <span>{c.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={() => navigate("/cart/checkout")}
          variant="palmPrimary"
          className="mt-5 h-12 w-full rounded-xl text-sm font-bold shadow-sm"
          disabled={!hasAnyItems || hasInvalidBookings || hasConflicts}
        >
          {!hasAnyItems
            ? "Cart is Empty"
            : hasConflicts
            ? "Resolve Conflicts First"
            : hasInvalidBookings
            ? "Select Dates First"
            : "Proceed to Checkout"
          }
        </Button>
    </div>
  );
}
