import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import OrderSummary from '@/components/Checkout/OrderSummary';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import OrderReceived from '@/components/Checkout/OrderReceived';
import BillingDetails from '@/components/Checkout/BillingDetails';
import { checkoutSchema } from './checkoutSchema';
import {
  selectCartItems,
  selectCartTotal,
  selectCartRequiresAttention,
  clearCart,
} from '@/store/slices/cartSlice';
import { 
  createBooking, 
} from '@/services/booking/bookingSlice';
import { toast } from 'react-toastify';

const PENDING_CHECKOUT_KEY = 'pendingCheckoutSession';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const MotionDiv = motion.div;
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartRequiresAttention = useSelector(selectCartRequiresAttention);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderReceived, setOrderReceived] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      createAccount: false,
      orderNotes: '',
      agreeTerms: false,
    }
  });

  const buildOrderReceived = (data, items, total, method) => {
    const isCardPayment = method === 'card';

    return {
      ...data,
      orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items,
      total,
      paymentCategory: isCardPayment ? 'Visa / Stripe' : 'Check payments',
      paymentMethod: isCardPayment ? 'Visa card - paid online' : 'Cash on arrival',
      paymentNote: isCardPayment
        ? 'Your payment was completed securely via Stripe and your reservation has been confirmed.'
        : 'Reservation only. Please complete your payment in cash when you arrive at the hotel.',
    };
  };

  const createReservations = async ({ items, data, method }) => {
    if (items.some((item) => !item.checkInDate || !item.checkOutDate || item.availabilityStatus !== 'available')) {
      throw new Error('Some rooms are missing valid available dates.');
    }

    const bookingPromises = items
      .filter(item => item.checkInDate)
      .map(item => {
        const bookingData = {
          roomId: item.id,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          guests: item.guests || 1,
          paymentMethod: method === 'card' ? 'card' : 'cash',
          paymentStatus: method === 'card' ? 'paid' : 'unpaid',
          specialRequests: data.orderNotes || 'Booked from Website',
        };
        return dispatch(createBooking(bookingData)).unwrap();
      });

    if (bookingPromises.length > 0) {
      await Promise.all(bookingPromises);
    }
  };

  const storePendingCheckout = (formData) => {
    if (typeof window === 'undefined') return;

    const snapshot = {
      formData,
      cartItems,
      cartTotal,
      paymentMethod,
      createdAt: Date.now(),
    };

    window.sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(snapshot));
  };

  useEffect(() => {
    if (cartItems.length > 0 && cartRequiresAttention) {
      toast.info('Please review your cart dates before checkout.');
      navigate('/cart', { replace: true });
    }
  }, [cartItems.length, cartRequiresAttention, navigate]);

  useEffect(() => {
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
        if (!rawSnapshot) {
          toast.error('Payment succeeded, but checkout data could not be restored.');
          navigate('/cart/checkout', { replace: true });
          return;
        }

        const snapshot = JSON.parse(rawSnapshot);
        await createReservations({
          items: snapshot.cartItems || [],
          data: snapshot.formData || {},
          method: 'card',
        });

        setOrderReceived(
          buildOrderReceived(
            snapshot.formData || {},
            snapshot.cartItems || [],
            snapshot.cartTotal || 0,
            'card'
          )
        );
        setIsModalOpen(true);
        dispatch(clearCart());
        window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
        toast.success('Payment completed and your reservation is confirmed.');
      } catch (err) {
        console.error('Stripe checkout finalization failed:', err);
        toast.error('Payment succeeded, but reservation confirmation failed. Please contact support.');
      } finally {
        navigate('/cart/checkout', { replace: true });
      }
    };

    void finalizeStripeCheckout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, searchParams]);

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
                  checkoutItems={cartItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                  }))}
                  successUrl={`${window.location.origin}/cart/checkout?payment=success&method=card`}
                  cancelUrl={`${window.location.origin}/cart/checkout?payment=cancel&method=card`}
                  onBeforeStripeRedirect={storePendingCheckout}
                  onSuccess={async (data) => {
                    try {
                      await createReservations({
                        items: cartItems,
                        data,
                        method: 'cash',
                      });

                      setOrderReceived(buildOrderReceived(data, cartItems, cartTotal, 'cash'));
                      setIsModalOpen(true);
                      dispatch(clearCart());
                      toast.success('Your room(s) have been reserved successfully.');
                    } catch (err) {
                      console.error('Booking failed:', err);
                      toast.error('Reservation failed. Please check your details and try again.');
                    }
                  }}
                  resetForm={reset}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
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
              className="bg-background w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 custom-scrollbar"
            >
              <div className="sticky top-0 right-0 z-20 flex justify-end p-6 bg-linear-to-b from-background via-background/80 to-transparent pointer-events-none">
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="bg-muted/50 hover:bg-muted border border-border pointer-events-auto shadow-sm"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>

              <div className="px-8 pb-12 md:px-16 md:pb-20 -mt-12">
                <OrderReceived orderReceived={orderReceived} />
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
