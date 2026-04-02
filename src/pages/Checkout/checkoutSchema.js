import * as z from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  company: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(5, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'Town / City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(3, 'Postcode is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'),
  createAccount: z.boolean().optional(),
  orderNotes: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});
