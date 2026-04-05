import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import axiosInstance from '@/services/axiosInstance';

const CheckoutForm = ({
  paymentMethod,
  resetForm,
  onSuccess,
  onError,
  getValues,
  handleSubmitHook,
  checkoutItems,
  onBeforeStripeRedirect,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isCartEmpty = !Array.isArray(checkoutItems) || checkoutItems.length === 0;

  const onSubmit = async () => {
    if (isCartEmpty) {
      const message = 'Your cart is empty. Please add a room before checkout.';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = getValues();

      if (paymentMethod === 'card') {
        onBeforeStripeRedirect(data);

        const response = await axiosInstance.post('/payment/create-checkout-session', {
          items: checkoutItems,
          customerEmail: data.email,
        });

        const checkoutStatus = response?.data?.data?.status;
        const redirectUrl = response?.data?.data?.url;
        const sessionId = response?.data?.data?.sessionId;

        if (!redirectUrl && checkoutStatus === 'fulfilled' && sessionId) {
          window.location.href = `/cart/checkout?payment=success&method=card&session_id=${encodeURIComponent(sessionId)}`;
          return;
        }

        if (!redirectUrl) {
          throw new Error('Failed to retrieve checkout URL');
        }

        window.location.href = redirectUrl;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1200));
      await onSuccess(data);
      resetForm();
    } catch (err) {
      await onError?.(err);
      const statusCode = err?.response?.status;
      const apiMessage = err?.response?.data?.message;
      const fallbackMessage =
        statusCode === 401
          ? 'Please login before continuing to checkout.'
          : apiMessage || 'An error occurred while processing your order. Please try again.';

      setError(fallbackMessage);
      console.error('Order error:', err);
      toast.error(fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitHook(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={loading || isCartEmpty}
        variant="palmPrimary"
        className="w-full h-12 rounded-md font-bold transition-all shadow-lg hover:shadow-primary/20 tracking-wider uppercase text-sm"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (paymentMethod === 'card' ? 'Pay with Visa' : 'Reserve Now, Pay on Arrival')}
      </Button>

      <p className="text-[11px] text-center text-muted-foreground mt-4 leading-relaxed">
        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
      </p>
    </form>
  );
};

export default CheckoutForm;
