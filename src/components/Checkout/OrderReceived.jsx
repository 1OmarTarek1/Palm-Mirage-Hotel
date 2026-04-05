import React, { useState } from "react";

import { Button } from "@/components/ui/button";

const OrderReceived = ({ orderReceived }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  if (!orderReceived) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { default: InvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./InvoicePDF"),
      ]);

      const blob = await pdf(<InvoicePDF orderReceived={orderReceived} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${orderReceived.filePrefix || "Hotel-Invoice"}-${orderReceived.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 invoice-container relative">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .invoice-container, .invoice-container * {
              visibility: visible;
            }
            .invoice-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
          /* PDF Color Overrides (html2canvas oklab fix): Force HEX/RGBA ONLY when exporting */
        `}
      </style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-foreground">Success!</h1>
          <p className="text-lg text-muted-foreground italic">Thank you. Your order has been received.</p>
        </div>
        
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          variant="light"
          size="default"
          className="no-print flex items-center justify-center gap-2 group"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{orderReceived.downloadLabel || "Download Invoice (PDF)"}</span>
            </>
          )}
        </Button>
      </div>        
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
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{orderReceived.amountLabel || 'Total'}:</p>
            <p className="text-sm font-bold text-foreground">${orderReceived.total.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status:</p>
            <p className="text-sm font-bold text-foreground">{orderReceived.paymentStatus || orderReceived.paymentCategory || orderReceived.paymentMethod}</p>
          </div>
        </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{orderReceived.documentTitle || 'Payment Note'}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {orderReceived.paymentNote || `Reservation only. Please complete payment via ${orderReceived.paymentMethod} on arrival.`}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-serif text-foreground">Reservation Details</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary/70 text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-border">Product</th>
                <th className="px-6 py-4 font-medium border-b border-border text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-color-primary/70">
              {orderReceived.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-5 text-muted-foreground">
                    {item.name} <span className="text-foreground font-medium ml-1">× {item.quantity}</span>
                  </td>
                  <td className="px-6 py-5 text-right text-foreground font-medium italic">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <th className="px-6 py-4 font-bold text-foreground">Subtotal:</th>
                <td className="px-6 py-4 text-right text-foreground font-bold italic">${orderReceived.total.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="px-6 py-4 font-bold text-foreground">Payment plan:</th>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {(orderReceived.paymentCategory || 'Payment')} / {orderReceived.paymentMethod}
                </td>
              </tr>
              <tr className="bg-primary/70">
                <th className="px-6 py-4 font-bold text-lg text-white">{orderReceived.amountLabel || 'Total'}:</th>
                <td className="px-6 py-4 text-right text-white font-bold text-lg italic">${orderReceived.total.toFixed(2)}</td>
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
          <p>
            {orderReceived.city}{orderReceived.city?.toLowerCase() !== orderReceived.state?.toLowerCase() ? `, ${orderReceived.state}` : ''} {orderReceived.postcode}
          </p>
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
