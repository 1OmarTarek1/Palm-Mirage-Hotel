import React from 'react';
import { Separator } from '@/components/ui/separator';

const OrderSummary = ({ selectedMethod, onMethodChange }) => {
  const orderItems = [
    {
      id: 1,
      name: 'Summit View King Room',
      quantity: 1,
      date: 'February 22, 2026 - February 23, 2026',
      details: 'Adult: 1; Child: 0',
      price: 120.0,
    },
    {
      id: 2,
      name: 'Summit View King Room',
      quantity: 1,
      date: 'February 24, 2026 - February 25, 2026',
      details: 'Adult: 1; Child: 0',
      price: 100.0,
    },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="bg-card/50 p-6 rounded-2xl border border-border">
      <h2 className="text-2xl font-serif text-foreground mb-6">Your Order</h2>
      
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
                <span className="font-medium">Date:</span> {item.date}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Details:</span> {item.details}
              </p>
            </div>
            <span className="text-sm font-medium text-foreground italic">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-6 bg-border" />

      <div className="space-y-4">
        <div className="flex justify-between items-center font-medium">
          <span className="text-foreground">Subtotal</span>
          <span className="text-foreground italic">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg">
          <span className="text-foreground">Total</span>
          <span className="text-foreground italic">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {/* Check Payments */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onMethodChange('check')}
        >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedMethod === 'check' ? 'border-primary bg-primary' : 'border-border'}`}>
                {selectedMethod === 'check' && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedMethod === 'check' ? 'text-foreground' : 'text-muted-foreground'}`}>Check payments</span>
        </div>
        
        {selectedMethod === 'check' && (
          <div className="bg-muted p-4 rounded-lg relative transition-all animate-in fade-in slide-in-from-top-1">
              <div className="absolute -top-2 left-4 w-4 h-4 bg-muted rotate-45" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                  Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
              </p>
          </div>
        )}

        {/* Stripe */}
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => onMethodChange('stripe')}
        >
            <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedMethod === 'stripe' ? 'border-primary bg-primary' : 'border-border'}`}>
                    {selectedMethod === 'stripe' && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <span className={`text-sm font-medium transition-colors ${selectedMethod === 'stripe' ? 'text-foreground' : 'text-muted-foreground'}`}>Stripe</span>
            </div>
            <div className="flex gap-1 items-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 dark:invert dark:opacity-40 hover:dark:opacity-100 dark:grayscale-0 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
            </div>
        </div>
        
        {selectedMethod === 'stripe' && (
          <div className="bg-muted p-4 rounded-lg relative transition-all animate-in fade-in slide-in-from-top-1">
              <div className="absolute -top-2 left-4 w-4 h-4 bg-muted rotate-45" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay via Stripe; you can pay with your credit card if you don't have a Stripe account.
              </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
