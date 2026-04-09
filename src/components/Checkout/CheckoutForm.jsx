import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import axiosInstance from '@/services/axiosInstance';

const buildCheckoutPayload = ({
  checkoutItems,
  restaurantBookings,
  activityBookings,
  customerEmail,
  bookingNotes,
}) => ({
  items: Array.isArray(checkoutItems)
    ? checkoutItems.map((item) => ({
        roomId: item.roomId,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        guests: item.guests || 1,
      }))
    : [],
  restaurantBookings: Array.isArray(restaurantBookings)
    ? restaurantBookings.map((booking) => {
        const normalizedBooking = {
          bookingMode: booking.bookingMode,
          date: booking.date,
          time: booking.time,
          guests: Number(booking.guests) || 1,
          lineItems: Array.isArray(booking.lineItems)
            ? booking.lineItems.map((lineItem) => ({
                menuItemId: lineItem.menuItemId,
                qty: Number(lineItem.qty) || 0,
                name: lineItem.name,
                price: Number(lineItem.price) || 0,
                image: lineItem.image || '',
              }))
            : [],
          lineItemsTotal: Number(booking.lineItemsTotal) || 0,
        };

        if (booking.bookingMode === 'room_service') {
          normalizedBooking.roomNumber = Number(booking.roomNumber) || null;
        }

        if (booking.bookingMode === 'table_only' || booking.bookingMode === 'dine_in') {
          normalizedBooking.number = Number(booking.number) || null;
        }

        return normalizedBooking;
      })
    : [],
  activityBookings: Array.isArray(activityBookings)
    ? activityBookings.map((booking) => ({
        activityId: booking.activityId,
        activityTitle: booking.activityTitle,
        scheduleId: booking.scheduleId,
        scheduleDate: booking.scheduleDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        guests: booking.guests,
        contactPhone: booking.contactPhone,
        pricingType: booking.pricingType,
        price: booking.price,
        notes: booking.notes || '',
        activityImage: booking.activityImage || '',
      }))
    : [],
  customerEmail,
  bookingNotes,
});

const getErrorMessage = (err) => {
  const statusCode = err?.response?.status;
  const validationDetails = err?.response?.data?.details;
  const firstValidationMessage =
    Array.isArray(validationDetails) && validationDetails.length > 0
      ? validationDetails[0]?.message
      : null;
  const apiMessage = err?.response?.data?.message;

  if (statusCode === 401) {
    return 'Please login before continuing to checkout.';
  }

  return firstValidationMessage || apiMessage || 'An error occurred while processing your order. Please try again.';
};

const CheckoutForm = ({
  paymentMethod,
  resetForm,
  onSuccess,
  onError,
  onBeforeSubmit,
  getValues,
  handleSubmitHook,
  checkoutItems,
  restaurantBookings,
  activityBookings,
  onBeforeStripeRedirect,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasRooms = Array.isArray(checkoutItems) && checkoutItems.length > 0;
  const hasRestaurant = Array.isArray(restaurantBookings) && restaurantBookings.length > 0;
  const hasActivities = Array.isArray(activityBookings) && activityBookings.length > 0;
  const isCartEmpty = !hasRooms && !hasRestaurant && !hasActivities;

  const onSubmit = async () => {
    if (isCartEmpty) {
      const message = 'Your cart is empty. Please add at least one booking before checkout.';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = getValues();
      const canContinue = await onBeforeSubmit?.(data);
      if (canContinue === false) {
        return;
      }

      if (paymentMethod === 'card') {
        onBeforeStripeRedirect(data);
        const payload = buildCheckoutPayload({
          checkoutItems,
          restaurantBookings,
          activityBookings,
          customerEmail: data.email,
          bookingNotes: data.orderNotes || '',
        });

        const response = await axiosInstance.post('/payment/create-checkout-session', payload);

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
      const fallbackMessage = getErrorMessage(err);

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
