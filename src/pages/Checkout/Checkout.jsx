import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import OrderSummary from '@/components/Checkout/OrderSummary';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import OrderReceived from '@/components/Checkout/OrderReceived';
import BillingDetails from '@/components/Checkout/BillingDetails';
import { checkoutSchema } from './checkoutSchema';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/slices/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  
  const [paymentMethod, setPaymentMethod] = useState('check');
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
    trigger,
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
                  amount={cartTotal} 
                  handleSubmitHook={handleSubmit}
                  getValues={getValues}
                  paymentMethod={paymentMethod}
                  onSuccess={(data) => {
                    setOrderReceived({
                      ...data,
                      orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
                      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                      items: cartItems,
                      total: cartTotal,
                      paymentMethod: paymentMethod === 'check' ? 'Check payments' : 'Stripe'
                    });
                    setIsModalOpen(true);
                    dispatch(clearCart());
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
