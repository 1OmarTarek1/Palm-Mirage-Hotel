import React from 'react';
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';

const OrderSummary = ({ selectedMethod, onMethodChange }) => {
  const orderItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const paymentOptions = [
    {
      id: 'cash',
      label: 'Cash',
      description: 'Reserve now and pay with cash when you arrive at the hotel.',
    },
    {
      id: 'card',
      label: 'Visa',
      description: 'Reserve now and pay by Visa card at the front desk on arrival.',
    },
  ];

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="bg-card/50 p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-header text-foreground mb-6">Your Order</h2>
        <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border">
      <h2 className="text-2xl font-header text-foreground mb-6">Your Order</h2>
      
      <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
        <span>Product</span>
        <span>Total</span>
      </div>
      
      <div className="space-y-6">
        {orderItems.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">
                {item.name} <span className="text-muted-foreground/60">× {item.quantity}</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Date:</span> {item.date || 'TBD'}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Details:</span> {item.details || '1 Adult'}
              </p>
            </div>
            <span className="text-sm font-medium text-foreground italic">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-6 bg-border" />

      <div className="space-y-4">
        <div className="flex justify-between items-center font-medium">
          <span className="text-foreground">Subtotal</span>
          <span className="text-foreground italic">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg">
          <span className="text-foreground">Total</span>
          <span className="text-foreground italic">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-border bg-muted/25 p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-primary bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
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
                    ? 'border-primary bg-primary/8'
                    : 'border-border bg-background/70 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    selectedMethod === option.id ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selectedMethod === option.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${selectedMethod === option.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </p>
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
