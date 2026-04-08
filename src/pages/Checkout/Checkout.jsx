import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppModal from '@/components/common/AppModal';
import { Button } from '@/components/ui/button';
import OrderSummary from '@/components/Checkout/OrderSummary';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import OrderReceived from '@/components/Checkout/OrderReceived';
import BillingDetails from '@/components/Checkout/BillingDetails';
import { CheckoutPageSkeleton } from '@/components/common/loading/AppPageSkeletons';
import { getRestaurantBookingModeLabel, isRestaurantTableMode } from '@/components/profile/profileUtils';
import { checkoutSchema } from './checkoutSchema';
import axiosInstance from '@/services/axiosInstance';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { refreshUserSnapshot } from '@/services/userSnapshot';
import { fetchRoomAvailability } from '@/services/roomsApi';
import {
  selectCartItems,
  selectCartTotal,
  selectCartRequiresAttention,
  clearCart,
  removeItem,
  selectPendingRestaurantBookings,
  selectPendingActivityBookings,
  removePendingRestaurantBooking as removePendingRestaurantBookingAction,
  removePendingActivityBooking as removePendingActivityBookingAction,
  clearPendingRestaurantBookings,
  clearPendingActivityBookings,
} from '@/store/slices/cartSlice';
import { 
  createBooking, 
} from '@/services/booking/bookingSlice';
import { 
  createTableBooking,
  createRestaurantCheckoutSession,
} from '@/services/restaurantBookings/restaurantBookingsSlice';
import {
  createActivityBooking,
  createActivityCheckoutSession,
} from '@/services/activityBookings/activityBookingsSlice';
import { toast } from 'react-toastify';

const PENDING_CHECKOUT_KEY = 'pendingCheckoutSession';
const PENDING_PAYMENT_SYNC_KEY = 'pendingPaymentSync';
const COMPLETED_CHECKOUT_KEY = 'completedCheckoutOrder';
const COMPLETED_CHECKOUT_TOAST_KEY = 'completedCheckoutToast';
const EMPTY_CHECKOUT_TOAST_KEY = 'emptyCheckoutToastShown';

const normalizeCheckoutErrorMessage = (error, fallbackMessage) => {
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return (
    error?.response?.data?.details?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const MotionDiv = motion.div;
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartRequiresAttention = useSelector(selectCartRequiresAttention);
  const pendingRestaurantBookings = useSelector(selectPendingRestaurantBookings);
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const hasRoomBookings = cartItems.length > 0;
  const hasRestaurantBookings = pendingRestaurantBookings.length > 0;
  const hasActivityBookings = pendingActivityBookings.length > 0;
  const isCheckoutEmpty = !hasRoomBookings && !hasRestaurantBookings && !hasActivityBookings;
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderReceived, setOrderReceived] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolvingCheckoutCart, setIsResolvingCheckoutCart] = useState(false);
  const [isFinalizingCheckout, setIsFinalizingCheckout] = useState(false);
  const [hasResolvedInitialCheckoutSnapshot, setHasResolvedInitialCheckoutSnapshot] = useState(false);
  const hasStartedInitialCheckoutSnapshotRef = useRef(false);

  const isAvailabilityConflictError = (error) => {
    const statusCode = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || '';
    return statusCode === 409 || /no longer available|currently unavailable/i.test(message);
  };

  const removeUnavailableCartItems = async (items) => {
    const availabilityResults = await Promise.allSettled(
      items.map(async (item) => {
        if (!item?.id || !item?.checkInDate || !item?.checkOutDate) {
          return { item, isBookable: true };
        }

        const availability = await fetchRoomAvailability(item.id, {
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
        });

        return {
          item,
          isBookable: availability?.isBookable !== false,
        };
      }),
    );

    const unavailableItems = availabilityResults
      .filter((result) => result.status === 'fulfilled' && result.value?.isBookable === false)
      .map((result) => result.value.item);

    unavailableItems.forEach((item) => {
      dispatch(removeItem(item.id));
    });

    return unavailableItems;
  };

  /**
   * Pre-flight: verify every cart item is still available BEFORE sending
   * any booking to the backend. Returns an array of conflict objects or
   * an empty array if everything is OK.
   */
  const runPreflightChecks = async () => {
    const preflightConflicts = [];

    // ── Rooms ──
    await Promise.allSettled(
      cartItems.map(async (item) => {
        if (!item.checkInDate || !item.checkOutDate) {
          preflightConflicts.push({
            name: item.name || 'Room',
            reason: 'Missing check-in or check-out dates.',
          });
          return;
        }
        try {
          const avail = await fetchRoomAvailability(item.id, {
            checkInDate: item.checkInDate,
            checkOutDate: item.checkOutDate,
          });
          if (avail?.isBookable === false) {
            preflightConflicts.push({
              name: item.name || 'Room',
              reason: `Not available for ${item.checkInDate} → ${item.checkOutDate}.`,
            });
          }
        } catch {
          // network error — allow through, backend will catch it
        }
      })
    );

    // ── Restaurant tables ──
    const tableBookings = pendingRestaurantBookings.filter((b) => isRestaurantTableMode(b.bookingMode));
    await Promise.allSettled(
      tableBookings.map(async (booking) => {
        if (!booking.date || !booking.time) return;
        try {
          const res = await axiosInstance.get('/booking/available-tables', {
            params: { date: booking.date, time: booking.time },
          });
          const tables = res?.data?.data?.tables || [];
          const tableNum = Number(booking.number ?? booking.selectedTable);
          const stillAvailable = tables.some((t) => Number(t.number) === tableNum);
          if (!stillAvailable) {
            preflightConflicts.push({
              name: `Table ${tableNum}`,
              reason: `Table ${tableNum} on ${booking.date} at ${booking.time} is no longer available.`,
            });
          }
        } catch {
          // network error — allow through
        }
      })
    );

    return preflightConflicts;
  };

  const handleCloseOrderModal = () => {
    setIsModalOpen(false);

    // After successful booking, navigate to profile page to see the booking
    if (orderReceived) {
      toast.info('Redirecting to your profile to view your booking...');
      navigate(orderReceived.profileTarget || '/profile', { replace: true });
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  };

  // Prevention of scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      country: 'Egypt',
      address: '',
      apartment: '',
      city: '',
      state: '',
      postcode: '',
      phone: '',
      email: '',
      agreeTerms: false,
    }
  });

  const buildOrderReceived = (data, items, total, method) => {
    const isCardPayment = method === 'card';
    const sumRestaurantLineItems = (lineItems = []) =>
      lineItems.reduce((sum, li) => {
        const unitPrice = Number(li?.price ?? li?.unitPrice ?? 0);
        const qty = Number(li?.qty ?? 0);
        return sum + (unitPrice * qty);
      }, 0);

    // Normalize items for the invoice display
    const normalizedItems = items.map((item) => {
      // Room item
      if (item.nights) {
        return {
          name: `${item.name || 'Room'} (${item.nights} nights)`,
          quantity: item.roomsCount || 1,
          price: item.price || 0,
        };
      }
      // Restaurant booking (pending)
      if (item.bookingMode) {
        const itemCount = (item.lineItems || []).reduce((s, li) => s + (li.qty || 0), 0);
        return {
          name: `Restaurant: ${getRestaurantBookingModeLabel(item.bookingMode)}${itemCount > 0 ? ` (${itemCount} dishes)` : ''}`,
          quantity: 1,
          price: sumRestaurantLineItems(item.lineItems || []),
        };
      }
      // Activity booking (pending)
      if (item.activityTitle || item.activity?.title) {
        return {
          name: `Activity: ${item.activityTitle || item.activity?.title || 'Experience'}`,
          quantity: item.guests || 1,
          price: item.price || item.unitPrice || item.totalPrice || 0,
        };
      }
      // Fallback
      return {
        name: item.name || 'Service',
        quantity: item.quantity || 1,
        price: item.price || 0,
      };
    });

    return {
      ...data,
      orderId: Math.floor(10000 + Math.random() * 90000).toString(), // Consistent with orderNumber
      orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: normalizedItems,
      total,
      documentTitle: isCardPayment ? 'Invoice & Payment Receipt' : 'Reservation Confirmation',
      downloadLabel: isCardPayment ? 'Download Invoice (PDF)' : 'Download Reservation Confirmation (PDF)',
      filePrefix: isCardPayment ? 'Hotel-Invoice' : 'Reservation-Confirmation',
      paymentCategory: isCardPayment ? 'Visa / Stripe' : 'Pay on arrival',
      paymentMethod: isCardPayment ? 'Visa card - paid online' : 'Cash on arrival',
      paymentStatus: isCardPayment ? 'Paid' : 'Unpaid',
      amountLabel: isCardPayment ? 'Amount paid' : 'Amount due on arrival',
      paymentNote: isCardPayment
        ? 'Your payment was completed securely via Stripe and your reservation has been confirmed.'
        : 'Your reservation is confirmed. Please pay the amount due in cash when you arrive at the hotel.',
      profileTarget: items.some((item) => item?.nights)
        ? '/profile#room-bookings-section'
        : items.some((item) => item?.bookingMode)
          ? '/profile#table-bookings-section'
          : items.some((item) => item?.activityTitle || item?.activity?.title)
            ? '/profile#activity-bookings-section'
            : '/profile',
    };
  };

  const storeCompletedCheckout = (sessionIdValue, orderReceivedValue) => {
    if (typeof window === 'undefined' || !sessionIdValue || !orderReceivedValue) return;

    window.sessionStorage.setItem(
      COMPLETED_CHECKOUT_KEY,
      JSON.stringify({
        sessionId: sessionIdValue,
        orderReceived: orderReceivedValue,
        createdAt: Date.now(),
      }),
    );
  };

  const loadCompletedCheckout = (sessionIdValue) => {
    if (typeof window === 'undefined' || !sessionIdValue) return null;

    const rawValue = window.sessionStorage.getItem(COMPLETED_CHECKOUT_KEY);
    if (!rawValue) return null;

    try {
      const parsed = JSON.parse(rawValue);
      if (parsed?.sessionId === sessionIdValue) {
        return parsed.orderReceived || null;
      }
    } catch (error) {
      console.error('Failed to parse completed checkout snapshot:', error);
    }

    return null;
  };

  const waitForCheckoutFulfillment = async (sessionIdValue) => {
    const maxAttempts = 8;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const response = await axiosInstance.get(`/payment/checkout-session/${encodeURIComponent(sessionIdValue)}`);
      const checkoutData = response?.data?.data ?? {};

      if (checkoutData.status === 'fulfilled' || checkoutData.paymentStatus === 'paid') {
        return checkoutData;
      }

      if (['failed', 'expired', 'cancelled'].includes(checkoutData.status)) {
        throw new Error(`Checkout finalization failed with status "${checkoutData.status}".`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    throw new Error('Timed out while waiting for payment confirmation.');
  };

  const showCheckoutSuccessToastOnce = (sessionIdValue) => {
    if (typeof window === 'undefined' || !sessionIdValue) return;

    const rawValue = window.sessionStorage.getItem(COMPLETED_CHECKOUT_TOAST_KEY);
    if (rawValue === sessionIdValue) {
      return;
    }

    window.sessionStorage.setItem(COMPLETED_CHECKOUT_TOAST_KEY, sessionIdValue);
    toast.success('Payment completed successfully!');
  };

  const showEmptyCheckoutToastOnce = () => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(EMPTY_CHECKOUT_TOAST_KEY) === 'true') {
      return;
    }

    window.sessionStorage.setItem(EMPTY_CHECKOUT_TOAST_KEY, 'true');
    toast.info('Your cart is empty. Please add at least one booking before checkout.');
  };

  const createReservations = async ({ items, data, method }) => {
    if (items.some((item) => !item.checkInDate || !item.checkOutDate || item.availabilityStatus !== 'available')) {
      throw new Error('Some rooms are missing valid available dates.');
    }

    const bookingItems = items.filter((item) => item.checkInDate);
    const bookingResults = await Promise.allSettled(
      bookingItems.map((item) => {
        const bookingData = {
          roomId: item.id,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          guests: item.guests || 1,
          paymentMethod: method === 'card' ? 'card' : 'cash',
          specialRequests: 'Booked from Website',
        };
        return dispatch(createBooking(bookingData)).unwrap();
      }),
    );

    const successfulItems = [];
    const conflictedItems = [];
    const failedResults = [];

    bookingResults.forEach((result, index) => {
      const item = bookingItems[index];

      if (result.status === 'fulfilled') {
        successfulItems.push(item);
        return;
      }

      if (isAvailabilityConflictError(result.reason)) {
        conflictedItems.push(item);
        return;
      }

      failedResults.push(result.reason);
    });

    successfulItems.forEach((item) => {
      dispatch(removeItem(item.id));
    });

    conflictedItems.forEach((item) => {
      dispatch(removeItem(item.id));
    });

    if (failedResults.length > 0) {
      throw failedResults[0];
    }

    return {
      successfulItems,
      conflictedItems,
    };
  };

  const createPendingRestaurantBookings = async (method) => {
    if (pendingRestaurantBookings.length === 0) {
      return { successfulBookings: [], failedBookings: [] };
    }

    const bookingResults = await Promise.allSettled(
      pendingRestaurantBookings.map((booking) => {
        const payload = {
          bookingMode: booking.bookingMode,
          date: booking.date,
          time: booking.time,
          guests: Number(booking.guests) || 1,
          lineItems: Array.isArray(booking.lineItems)
            ? booking.lineItems
                .map((lineItem) => ({
                  menuItemId: lineItem?.menuItemId,
                  qty: Number(lineItem?.qty) || 0,
                }))
                .filter((lineItem) => lineItem.menuItemId && lineItem.qty > 0)
            : [],
          paymentMethod: method === 'card' ? 'stripe' : booking.paymentMethod || 'cash',
        };

        if (booking.bookingMode === 'room_service') {
          payload.roomNumber = Number(booking.roomNumber) || null;
        }

        if (isRestaurantTableMode(booking.bookingMode)) {
          payload.number = Number(booking.number) || null;
        }

        return dispatch(createTableBooking({
          axiosPrivate,
          payload,
        })).unwrap();
      })
    );

    const successfulBookings = [];
    const failedBookings = [];

    bookingResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const booking = result.value?.data?.booking;
        if (booking) {
          successfulBookings.push(booking);
          dispatch(removePendingRestaurantBookingAction(pendingRestaurantBookings[index].id));
        }
      } else {
        failedBookings.push({
          booking: pendingRestaurantBookings[index],
          error: normalizeCheckoutErrorMessage(result.reason, 'Failed to create restaurant booking'),
        });
      }
    });

    return { successfulBookings, failedBookings };
  };

  const createPendingActivityBookings = async (method) => {
    if (pendingActivityBookings.length === 0) {
      return { successfulBookings: [], failedBookings: [] };
    }

    const bookingResults = await Promise.allSettled(
      pendingActivityBookings.map((booking) => {
        const payload = {
          scheduleId: booking.scheduleId,
          guests: Number(booking.guests) || 1,
          contactPhone: booking.contactPhone,
          notes: booking.notes,
          paymentMethod: method === 'card' ? 'card' : booking.paymentMethod || 'cash',
        };

        return dispatch(createActivityBooking({
          axiosPrivate,
          payload,
        })).unwrap();
      })
    );

    const successfulBookings = [];
    const failedBookings = [];

    bookingResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value) {
          successfulBookings.push(result.value);
          dispatch(removePendingActivityBookingAction(pendingActivityBookings[index].id));
        }
      } else {
        const normalizedError = normalizeCheckoutErrorMessage(
          result.reason,
          'Failed to create activity booking',
        );

        if (/already booked this activity session/i.test(normalizedError)) {
          dispatch(removePendingActivityBookingAction(pendingActivityBookings[index].id));
          return;
        }

        failedBookings.push({
          booking: pendingActivityBookings[index],
          error: normalizedError,
        });
      }
    });

    return { successfulBookings, failedBookings };
  };

  const handleCheckoutError = async (error) => {
    if (!isAvailabilityConflictError(error)) return;

    const unavailableItems = await removeUnavailableCartItems(cartItems);

    if (unavailableItems.length === 1) {
      toast.info(`${unavailableItems[0].name || 'This room'} was just booked by another guest and was removed from your cart.`);
      return;
    }

    if (unavailableItems.length > 1) {
      toast.info(`${unavailableItems.length} rooms were just booked by other guests and were removed from your cart.`);
      return;
    }

    toast.info('One or more selected rooms are no longer available for these dates.');
  };

  const storePendingCheckout = (formData) => {
    if (typeof window === 'undefined') return;

    const snapshot = {
      formData,
      cartItems,
      cartTotal,
      pendingRestaurantBookings,
      pendingActivityBookings,
      paymentMethod,
      createdAt: Date.now(),
    };

    window.sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(snapshot));
  };

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const paymentState = searchParams.get('payment');
    const paymentMethodParam = searchParams.get('method');
    if (paymentMethodParam === 'card' && (paymentState === 'success' || paymentState === 'cancel')) {
      setHasResolvedInitialCheckoutSnapshot(true);
      hasStartedInitialCheckoutSnapshotRef.current = true;
      return;
    }

    if (!isAuthenticated || !isCheckoutEmpty || isModalOpen || orderReceived) {
      setHasResolvedInitialCheckoutSnapshot(true);
      hasStartedInitialCheckoutSnapshotRef.current = true;
      return;
    }

    if (
      hasResolvedInitialCheckoutSnapshot ||
      isResolvingCheckoutCart ||
      hasStartedInitialCheckoutSnapshotRef.current
    ) {
      return;
    }

    hasStartedInitialCheckoutSnapshotRef.current = true;

    const resolveCheckoutSnapshot = async () => {
      setIsResolvingCheckoutCart(true);

      try {
        await refreshUserSnapshot({ dispatch, axiosPrivate });
      } catch (error) {
        console.error('Checkout snapshot refresh failed:', error);
      } finally {
        setIsResolvingCheckoutCart(false);
        setHasResolvedInitialCheckoutSnapshot(true);
      }
    };

    void resolveCheckoutSnapshot();
  }, [
    axiosPrivate,
    dispatch,
    hasResolvedInitialCheckoutSnapshot,
    isAuthenticated,
    isCheckoutEmpty,
    isHydrating,
    isModalOpen,
    isResolvingCheckoutCart,
    orderReceived,
    searchParams,
  ]);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    // When returning from Stripe, the cart may already be cleared.
    // Never redirect away from checkout based on an empty cart while processing payment return params.
    const paymentState = searchParams.get('payment');
    const paymentMethodParam = searchParams.get('method');
    if (paymentMethodParam === 'card' && (paymentState === 'success' || paymentState === 'cancel')) {
      return;
    }

    if (isModalOpen || orderReceived || isFinalizingCheckout) {
      return;
    }

    if (isResolvingCheckoutCart) {
      return;
    }

    if (isAuthenticated && !hasResolvedInitialCheckoutSnapshot) {
      return;
    }

    if (isCheckoutEmpty) {
      showEmptyCheckoutToastOnce();
      navigate('/cart', { replace: true });
      return;
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(EMPTY_CHECKOUT_TOAST_KEY);
    }

    if (hasRoomBookings && cartRequiresAttention) {
      toast.info('Please review your cart dates before checkout.');
      navigate('/cart', { replace: true });
    }
  }, [
    cartRequiresAttention,
    hasRoomBookings,
    isCheckoutEmpty,
    isHydrating,
    isAuthenticated,
    isModalOpen,
    isFinalizingCheckout,
    isResolvingCheckoutCart,
    hasResolvedInitialCheckoutSnapshot,
    navigate,
    orderReceived,
    searchParams,
  ]);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const paymentState = searchParams.get('payment');
    const paymentMethodParam = searchParams.get('method');
    if (paymentState === 'cancel' && paymentMethodParam === 'card') {
      toast.info('Visa payment was cancelled.');
      navigate('/cart/checkout', { replace: true });
      return;
    }

    if (paymentState !== 'success' || paymentMethodParam !== 'card') return;

    const finalizeStripeCheckout = async () => {
      try {
        const rawSnapshot = window.sessionStorage.getItem(PENDING_CHECKOUT_KEY);
        const snapshot = rawSnapshot ? JSON.parse(rawSnapshot) : null;
        const cachedOrderReceived = loadCompletedCheckout(sessionId);

        if (!sessionId) {
          toast.error('Payment succeeded, but the checkout session id is missing.');
          return;
        }

        window.sessionStorage.setItem(
          PENDING_PAYMENT_SYNC_KEY,
          JSON.stringify({ sessionId, createdAt: Date.now(), kind: "room" }),
        );

        await waitForCheckoutFulfillment(sessionId);
        await refreshUserSnapshot({ dispatch, axiosPrivate });
        await queryClient.invalidateQueries({ queryKey: ['notifications', 'inbox'] });

        if (cachedOrderReceived) {
          showCheckoutSuccessToastOnce(sessionId);
          setOrderReceived(cachedOrderReceived);
          setIsModalOpen(true);
          return;
        }

        if (snapshot) {
          // Re-calculate or use stored total
          const finalTotal = snapshot.cartTotal;
          
          // Bundle all items for the success summary / invoice
          const allItems = [
            ...(snapshot.cartItems || []),
            ...(snapshot.pendingRestaurantBookings || []),
            ...(snapshot.pendingActivityBookings || [])
          ];

          // Note: Backend webhook handles the actually DB insertion for card payments.
          const orderReceivedObj = buildOrderReceived(
            snapshot.formData || {}, 
            allItems, 
            finalTotal, 
            'card'
          );

          storeCompletedCheckout(sessionId, orderReceivedObj);
          
          showCheckoutSuccessToastOnce(sessionId);
          setOrderReceived(orderReceivedObj);
          setIsModalOpen(true);
          
          dispatch(clearCart());
          dispatch(clearPendingRestaurantBookings());
          dispatch(clearPendingActivityBookings());
          window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
          
          // Clear query params purely from the URL without triggering a route refresh
        } else {
          // Fallback if snapshot is lost
          toast.info('Payment is confirmed. Syncing your reservation…');
          navigate('/profile#room-bookings-section', { replace: true });
        }
      } catch (err) {
        console.error('Stripe checkout finalization failed:', err);
        toast.error('Payment succeeded, but reservation confirmation failed. Please contact support.');
      }
    };

    void finalizeStripeCheckout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosPrivate, dispatch, isHydrating, navigate, queryClient, searchParams, sessionId]);

  if (isHydrating || isResolvingCheckoutCart) return <CheckoutPageSkeleton />;

  return (
    <div className="relative min-h-screen">
      <div className={`transition-all duration-500 ${isModalOpen ? 'blur-sm grayscale-[0.5] pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Billing Details - Left Side */}
          <BillingDetails register={register} errors={errors} control={control} />

          {/* Order Summary & Payment - Right Side */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <OrderSummary 
                selectedMethod={paymentMethod} 
                onMethodChange={setPaymentMethod} 
              />
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Controller
                    name="agreeTerms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        className={`mt-1 ${errors.agreeTerms ? 'ring-2 ring-red-500' : ''}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    I have read and agree to the website <span className="text-zinc-900 dark:text-zinc-200 font-medium">terms and conditions</span> <span className="text-red-500">*</span>
                  </Label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-xs -mt-4 ml-7">{errors.agreeTerms.message}</p>}

                <CheckoutForm 
                  handleSubmitHook={handleSubmit}
                  getValues={getValues}
                  paymentMethod={paymentMethod}
                  onError={handleCheckoutError}
                  checkoutItems={cartItems.map((item) => ({
                    roomId: item.id,
                    checkInDate: item.checkInDate,
                    checkOutDate: item.checkOutDate,
                    guests: item.guests || 1,
                    name: item.name,
                    price: item.price,
                  }))}
                  restaurantBookings={pendingRestaurantBookings}
                  activityBookings={pendingActivityBookings}
                  onBeforeStripeRedirect={storePendingCheckout}
                  onSuccess={async (data) => {
                    setIsFinalizingCheckout(true);
                    try {
                      // Pre-flight: verify availability before sending anything to backend
                      const preflightConflicts = await runPreflightChecks();
                      if (preflightConflicts.length > 0) {
                        const names = preflightConflicts.map((c) => `\u2022 ${c.name}: ${c.reason}`).join('\n');
                        toast.error(
                          `Some items are no longer available:\n${names}\n\nPlease update or remove them before checkout.`,
                          { autoClose: 8000 }
                        );
                        return;
                      }

                      // Create room reservations
                      const { successfulItems, conflictedItems } = await createReservations({
                        items: cartItems,
                        data,
                        method: 'cash',
                      });

                      // Create pending restaurant bookings
                      const { successfulBookings: restaurantBookings, failedBookings: restaurantFailures } = await createPendingRestaurantBookings('cash');

                      // Create pending activity bookings  
                      const { successfulBookings: activityBookings, failedBookings: activityFailures } = await createPendingActivityBookings('cash');

                      // Handle room booking conflicts
                      if (conflictedItems.length > 0) {
                        if (conflictedItems.length === 1) {
                          toast.info(`${conflictedItems[0].name || 'This room'} was just booked by another guest and was removed from your cart.`);
                        } else {
                          toast.info(`${conflictedItems.length} rooms were just booked by other guests and were removed from your cart.`);
                        }
                      }

                      const failureMessages = [];
                      if (restaurantFailures.length > 0) {
                        failureMessages.push(
                          restaurantFailures[0]?.error ||
                            `${restaurantFailures.length} restaurant booking(s) failed. Please review them from your cart or profile.`,
                        );
                      }
                      if (activityFailures.length > 0) {
                        failureMessages.push(
                          activityFailures[0]?.error ||
                            `${activityFailures.length} activity booking(s) failed. Please review them from your cart or profile.`,
                        );
                      }

                      if (failureMessages.length > 0) {
                        toast.error(failureMessages.join('\n'), { autoClose: 8000 });
                      }

                      // Calculate total successful items
                      const allSuccessfulItems = [
                        ...successfulItems,
                        ...restaurantBookings,
                        ...activityBookings
                      ];

                      if (allSuccessfulItems.length === 0) {
                        toast.error('No bookings could be completed. Please try again.');
                        return;
                      }

                      // Calculate totals
                      const roomTotal = successfulItems.reduce(
                        (sum, item) => sum + (Number(item.price || 0) * Math.max(1, Number(item.nights || 1)) * Math.max(1, Number(item.roomsCount || 1))),
                        0,
                      );

                      const restaurantTotal = restaurantBookings.reduce((sum, booking) => {
                        return sum + (booking.lineItems?.reduce((itemSum, item) => {
                          const unitPrice = Number(item?.price ?? item?.unitPrice ?? 0);
                          return itemSum + (unitPrice * Number(item?.qty ?? 0));
                        }, 0) || 0);
                      }, 0);

                      const activityTotal = activityBookings.reduce((sum, booking) => {
                        const unitPrice = Number(booking.price ?? booking.unitPrice ?? 0);
                        const guests = Number(booking.guests || 1);
                        const totalPrice = Number(booking.totalPrice ?? 0);
                        return sum + (totalPrice || unitPrice * guests);
                      }, 0);

                      const finalTotal = roomTotal + restaurantTotal + activityTotal;

                      await refreshUserSnapshot({ dispatch, axiosPrivate });
                      await queryClient.invalidateQueries({ queryKey: ['notifications', 'inbox'] });

                      setOrderReceived(buildOrderReceived(data, allSuccessfulItems, finalTotal, 'cash'));
                      setIsModalOpen(true);
                      
                      // Show success message based on what was booked
                      const successMessages = [];
                      if (successfulItems.length > 0) {
                        successMessages.push(`${successfulItems.length} room(s) reserved`);
                      }
                      if (restaurantBookings.length > 0) {
                        successMessages.push(`${restaurantBookings.length} restaurant booking(s) confirmed`);
                      }
                      if (activityBookings.length > 0) {
                        successMessages.push(`${activityBookings.length} activity booking(s) confirmed`);
                      }

                      const hasConflicts = conflictedItems.length > 0 || restaurantFailures.length > 0 || activityFailures.length > 0;
                      
                      toast.success(
                        hasConflicts
                          ? `${successMessages.join(', ')} successfully. Some items are still waiting for you in cart/profile.`
                          : successMessages.length > 1
                          ? 'All your bookings have been confirmed successfully!'
                          : `${successMessages[0]} successfully!`
                      );
                    } catch (err) {
                      console.error('Booking failed:', err);
                      toast.error(
                        normalizeCheckoutErrorMessage(
                          err,
                          'Reservation failed. Please check your details and try again.',
                        ),
                      );
                    } finally {
                      setIsFinalizingCheckout(false);
                    }
                  }}
                  resetForm={reset}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppModal
        open={isModalOpen}
        onClose={handleCloseOrderModal}
        layout="plain"
        zIndex={100}
        closeOnBackdrop={false}
        showTint={false}
        outerClassName="items-center justify-center p-4 sm:pt-0 max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:overflow-hidden max-sm:p-0 max-sm:pt-[env(safe-area-inset-top,0px)]"
      >
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-5xl overflow-y-auto rounded-3xl bg-background shadow-2xl custom-scrollbar max-sm:min-h-0 max-sm:max-h-full max-sm:flex-1 max-sm:rounded-none max-sm:shadow-none sm:max-h-[90vh] sm:flex-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 right-0 z-20 flex justify-end p-6 bg-linear-to-b from-background via-background/80 to-transparent pointer-events-none">
            <Button
              onClick={handleCloseOrderModal}
              variant="ghost"
              size="icon"
              className="bg-muted/50 hover:bg-muted border border-border pointer-events-auto shadow-sm"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="-mt-12 px-8 pb-[max(3rem,env(safe-area-inset-bottom,0px))] md:px-16 md:pb-20">
            <OrderReceived
              orderReceived={orderReceived}
              onDownloadComplete={handleCloseOrderModal}
            />
          </div>
        </MotionDiv>
      </AppModal>
    </div>
  );
};

export default Checkout;
