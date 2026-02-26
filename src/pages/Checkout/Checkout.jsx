import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import OrderSummary from '@/components/Checkout/OrderSummary';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import OrderReceived from '@/components/Checkout/OrderReceived';
import BillingDetails from '@/components/Checkout/BillingDetails';
import { checkoutSchema } from './checkoutSchema';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('check');
  const [orderReceived, setOrderReceived] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    getValues,
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
    <div className="bg-background">
      {orderReceived ? (
        <OrderReceived orderReceived={orderReceived} />
      ) : (
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Billing Details - Left Side */}
            <BillingDetails register={register} errors={errors} />

            {/* Order Summary & Payment - Right Side */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                <OrderSummary 
                  selectedMethod={paymentMethod} 
                  onMethodChange={setPaymentMethod} 
                />
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="terms" {...register('agreeTerms')} className={`mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-800 accent-[#8fa492] ${errors.agreeTerms ? 'ring-2 ring-red-500' : ''}`} />
                    <Label htmlFor="terms" className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                      I have read and agree to the website <span className="text-zinc-900 dark:text-zinc-200 font-medium">terms and conditions</span> <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  {errors.agreeTerms && <p className="text-red-500 text-xs -mt-4 ml-7">{errors.agreeTerms.message}</p>}

                  <CheckoutForm 
                    amount={220} 
                    validateBilling={() => trigger()} 
                    getValues={() => getValues()}
                    paymentMethod={paymentMethod}
                    onSuccess={(data) => setOrderReceived({
                      ...data,
                      orderNumber: '14129',
                      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                      total: 220,
                      paymentMethod: paymentMethod === 'check' ? 'Check payments' : 'Stripe'
                    })}
                    resetForm={reset}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
