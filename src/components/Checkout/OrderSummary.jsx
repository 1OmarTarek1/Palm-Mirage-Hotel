import React from "react";
import { useSelector } from "react-redux";

import { Separator } from "@/components/ui/separator";
import { selectCartItems, selectCartTotal } from "@/store/slices/cartSlice";
import {
  calculateCartItemTotal,
  formatBookingDateLabel,
  isCartItemReady,
} from "@/utils/roomBooking";

const OrderSummary = ({ selectedMethod, onMethodChange }) => {
  const orderItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const hasInvalidBookings = orderItems.some((item) => !isCartItemReady(item));
  const paymentOptions = [
    {
      id: "cash",
      label: "Cash",
      description: "Reserve now and pay with cash when you arrive at the hotel.",
    },
    {
      id: "card",
      label: "Visa",
      description: "Reserve now and pay by Visa card at the front desk on arrival.",
    },
  ];

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="mb-6 text-2xl font-header text-foreground">Your Order</h2>
        <p className="py-8 text-center text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6">
      <h2 className="mb-6 text-2xl font-header text-foreground">Your Order</h2>

      <div className="mb-4 flex justify-between text-sm font-medium text-muted-foreground">
        <span>Product</span>
        <span>Total</span>
      </div>

      <div className="space-y-6">
        {orderItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Date:</span>{" "}
                {formatBookingDateLabel(item.checkInDate)} - {formatBookingDateLabel(item.checkOutDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Details:</span>{" "}
                {item.adults || 1} adult(s), {item.children || 0} children, {item.roomsCount || 1} room(s)
              </p>
            </div>
            <span className="text-sm font-medium italic text-foreground">
              ${calculateCartItemTotal(item).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-6 bg-border" />

      <div className="space-y-4">
        <div className="flex items-center justify-between font-medium">
          <span className="text-foreground">Subtotal</span>
          <span className="italic text-foreground">${total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <span className="text-foreground">Total</span>
          <span className="italic text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {hasInvalidBookings ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
            Return to the cart and fix unavailable or incomplete room dates before placing your reservation.
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-muted/25 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary bg-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Check payments</p>
              <p className="text-xs text-muted-foreground">
                Your booking will be confirmed now, and payment will be collected at check-in.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onMethodChange(option.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedMethod === option.id
                    ? "border-primary bg-primary/8"
                    : "border-border bg-background/70 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                      selectedMethod === option.id ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {selectedMethod === option.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-medium ${
                        selectedMethod === option.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
