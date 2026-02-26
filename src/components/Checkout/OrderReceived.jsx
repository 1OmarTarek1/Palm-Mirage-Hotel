import React from 'react';

const OrderReceived = ({ orderReceived }) => {
  if (!orderReceived) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-8">
        <p className="text-lg text-muted-foreground">Thank you. Your order has been received.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Order Number:</p>
            <p className="text-sm font-bold text-foreground">{orderReceived.orderNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date:</p>
            <p className="text-sm font-bold text-foreground">{orderReceived.date}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total:</p>
            <p className="text-sm font-bold text-foreground">${orderReceived.total.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Payment Method:</p>
            <p className="text-sm font-bold text-foreground">{orderReceived.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-serif text-foreground">Order Details</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-border">Product</th>
                <th className="px-6 py-4 font-medium border-b border-border text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-8 text-muted-foreground">
                  Summit View King Room <span className="text-foreground font-medium ml-1">× 1</span>
                </td>
                <td className="px-6 py-8 text-right text-foreground font-medium italic">$120.00</td>
              </tr>
              <tr>
                <td className="px-6 py-8 text-muted-foreground">
                  Summit View King Room <span className="text-foreground font-medium ml-1">× 1</span>
                </td>
                <td className="px-6 py-8 text-right text-foreground font-medium italic">$100.00</td>
              </tr>
              <tr>
                <th className="px-6 py-4 font-bold text-foreground">Subtotal:</th>
                <td className="px-6 py-4 text-right text-foreground font-bold italic">$220.00</td>
              </tr>
              <tr>
                <th className="px-6 py-4 font-bold text-foreground">Payment method:</th>
                <td className="px-6 py-4 text-right text-muted-foreground">Check payments</td>
              </tr>
              <tr className="bg-muted">
                <th className="px-6 py-6 font-bold text-lg text-foreground">Total:</th>
                <td className="px-6 py-6 text-right text-foreground font-bold text-lg italic">$220.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-serif text-foreground">Billing Address</h2>
        <div className="p-10 border border-border rounded-lg space-y-2 text-muted-foreground text-sm leading-relaxed">
          <p className="text-foreground font-medium mb-4 text-base">
            {orderReceived.firstName} {orderReceived.lastName}
          </p>
          {orderReceived.company && <p>{orderReceived.company}</p>}
          <p>{orderReceived.address}</p>
          {orderReceived.apartment && <p>{orderReceived.apartment}</p>}
          <p>{orderReceived.city}</p>
          <p>{orderReceived.state}</p>
          <p>{orderReceived.postcode}</p>
          <p>{orderReceived.country}</p>
          
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{orderReceived.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="underline cursor-pointer hover:text-foreground transition-colors">{orderReceived.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceived;
