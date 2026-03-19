import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const BillingDetails = ({ register, errors, control }) => {
  const countries = [
    "Egypt", "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", 
    "Bahrain", "Oman", "Jordan", "Lebanon", "USA", "UK", "Canada", "Germany", "France"
  ];

  const governorates = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
    "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", 
    "Sharqia", "Suez", "Aswan", "Assiut", "Beni Suef", "Damietta", 
    "Kafr El Sheikh", "Matrouh", "Port Said", "Sohag", "South Sinai", 
    "North Sinai", "Qena", "Luxor"
  ].sort();
  return (
    <div className="lg:col-span-8">
      <h2 className="text-2xl font-header text-foreground mb-8">Billing Details</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-muted-foreground">First name <span className="text-destructive">*</span></Label>
            <Input 
              id="first-name" 
              {...register('firstName')} 
              autoComplete="given-name"
              className={`h-12 bg-card/50 border-border ${errors.firstName ? 'border-destructive' : ''}`} 
            />
            {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-muted-foreground">Last name <span className="text-destructive">*</span></Label>
            <Input 
              id="last-name" 
              {...register('lastName')} 
              autoComplete="family-name"
              className={`h-12 bg-card/50 border-border ${errors.lastName ? 'border-destructive' : ''}`} 
            />
            {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-muted-foreground">Company name (optional)</Label>
          <Input 
            id="company" 
            {...register('company')} 
            autoComplete="organization"
            className="h-12 bg-card/50 border-border" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-muted-foreground">Country / Region <span className="text-destructive">*</span></Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && <p className="text-destructive text-xs">{errors.country.message}</p>}
        </div>

        <div className="space-y-4">
          <Label htmlFor="address" className="text-muted-foreground">Street address <span className="text-destructive">*</span></Label>
          <Input 
            id="address" 
            {...register('address')} 
            autoComplete="address-line1"
            placeholder="House number and street name" 
            className={`h-12 bg-card/50 border-border ${errors.address ? 'border-destructive' : ''}`} 
          />
          {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
          <Input 
            id="apartment" 
            {...register('apartment')} 
            autoComplete="address-line2"
            placeholder="Apartment, suite, unit, etc. (optional)" 
            className="h-12 bg-card/50 border-border" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-muted-foreground">Town / City <span className="text-destructive">*</span></Label>
          <Input 
            id="city" 
            {...register('city')} 
            autoComplete="address-level2"
            className={`h-12 bg-card/50 border-border ${errors.city ? 'border-destructive' : ''}`} 
          />
          {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-muted-foreground">State / County <span className="text-destructive">*</span></Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-muted-foreground">Postcode / ZIP <span className="text-destructive">*</span></Label>
          <Input 
            id="postcode" 
            {...register('postcode')} 
            autoComplete="postal-code"
            className={`h-12 bg-card/50 border-border ${errors.postcode ? 'border-destructive' : ''}`} 
          />
          {errors.postcode && <p className="text-destructive text-xs">{errors.postcode.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground">Phone <span className="text-destructive">*</span></Label>
          <Input 
            id="phone" 
            type="tel" 
            {...register('phone')} 
            autoComplete="tel"
            className={`h-12 bg-card/50 border-border ${errors.phone ? 'border-destructive' : ''}`} 
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">Email address <span className="text-destructive">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            {...register('email')} 
            autoComplete="email"
            className={`h-12 bg-card/50 border-border ${errors.email ? 'border-destructive' : ''}`} 
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <Controller
            name="createAccount"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="create-account" 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="create-account" className="text-sm font-medium text-muted-foreground">Create an account?</Label>
        </div>

        <div className="space-y-4 pt-8 border-t border-border">
          <h3 className="text-xl font-header text-foreground">Additional Information</h3>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">Order notes (optional)</Label>
            <textarea 
              id="notes" 
              {...register('orderNotes')}
              placeholder="Notes about your order, e.g. special notes for delivery." 
              className="w-full min-h-[120px] p-4 rounded-md border border-border bg-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
