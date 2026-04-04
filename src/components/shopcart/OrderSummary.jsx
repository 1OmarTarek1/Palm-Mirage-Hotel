import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  calculateCartItemTotal,
  formatBookingDateLabel,
  isCartItemReady,
} from "@/utils/roomBooking";

export default function OrderSummary({ cartItems, totalPrice }) {
  const navigate = useNavigate();
  const hasInvalidBookings = cartItems.some((item) => !isCartItemReady(item));

  return (
    <div className="sticky top-24 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

      <div className="space-y-3">
        {cartItems.map((item) => (
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
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="font-bold text-foreground">Total</span>
        <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Every room must have valid available dates before checkout can continue.
      </p>

      {hasInvalidBookings ? (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Some rooms still need date selection or are unavailable for the chosen stay.
        </div>
      ) : null}

      <Button
        onClick={() => navigate("/cart/checkout")}
        variant="palmPrimary"
        className="w-full h-12 rounded-xl text-sm font-bold shadow-sm"
        disabled={hasInvalidBookings}
      >
        {hasInvalidBookings ? "Select Dates First" : "Proceed to Checkout"}
      </Button>
    </div>
  );
}
