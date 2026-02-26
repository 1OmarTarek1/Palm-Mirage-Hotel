import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const CheckoutForm = ({ amount, validateBilling, paymentMethod, resetForm, onSuccess, getValues }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    // 1. Trigger validation on the billing form
    const isBillingValid = await validateBilling();
    if (!isBillingValid) {
      setError('Please fix the billing details errors before proceeding.');
      setLoading(false);
      return;
    }

    try {
      if (paymentMethod === 'stripe') {
        // 2a. Create Stripe Checkout Session
        const response = await axios.post('/create-checkout-session', {
          amount: amount * 100, // Amount in cents
        });

        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('Failed to retrieve checkout URL');
        }
      } else {
        // 2b. Handle Check Payments
        // In a real app, this would call /create-order or similar
        // For now, we'll simulate a slight delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Capture data before reset
        const data = getValues();
        
        // Reset the form on success
        resetForm();
        
        // Notify parent of success with captured data
        onSuccess(data);
        
        toast.success('Order placed successfully! Please send your check to the address provided.');
      }
    } catch (err) {
      setError('An error occurred while processing your order. Please try again.');
      console.error('Order error:', err);
      toast.error('Processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-full text-lg mt-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place Order')}
      </Button>

      <p className="text-[11px] text-center text-muted-foreground mt-4 leading-relaxed">
        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
      </p>
    </form>
  );
};

export default CheckoutForm;
