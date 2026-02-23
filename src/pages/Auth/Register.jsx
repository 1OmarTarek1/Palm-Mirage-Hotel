import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { registerSchema } from "./authSchema";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      userName: "",
      phoneNumber: "",
      country: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* -------------------- Header Section  -------------------- */}
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-2xl font-bold text-foreground">Create Account</h4>
        <p className="text-sm text-muted-foreground">Sign up to get started</p>
        <p className="text-sm text-muted-foreground">
          Already have an account?
          <Link
            to="/auth/login"
            className="text-primary font-medium hover:text-secondary transition ml-1"
          >
            Login
          </Link>
        </p>
      </div>

      {/* -------------------- Sign up Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- User Name Input Field ---------- */}
        <Field>
          <FieldLabel htmlFor="userName" className="text-foreground">
            User Name
          </FieldLabel>
          <Input
            id="userName"
            type="text"
            placeholder="Enter your Name"
            className="bg-background border-border focus:ring-2 focus:ring-primary"
            {...register("userName")}
          />
          {errors.userName && (
            <FieldDescription className="text-red-400">
              {errors.userName.message}
            </FieldDescription>
          )}
        </Field>

        {/* ---------- Phone & Country Fields ---------- */}
        <div className="flex gap-2">
          {/* ---------- Phone Number Input Field ---------- */}
          <Field>
            <FieldLabel htmlFor="phoneNumber" className="text-foreground">
              Phone Number
            </FieldLabel>
            <Input
              id="phoneNumber"
              type="text"
              placeholder="Enter your phone"
              className="bg-background border-border focus:ring-2 focus:ring-primary"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <FieldDescription className="text-red-400">
                {errors.phoneNumber.message}
              </FieldDescription>
            )}
          </Field>

          {/* ---------- Country Input Field ---------- */}
          <Field>
            <FieldLabel htmlFor="country" className="text-foreground">
              Country
            </FieldLabel>
            <Input
              id="country"
              type="text"
              placeholder="Enter your Country"
              className="bg-background border-border focus:ring-2 focus:ring-primary"
              {...register("country")}
            />
            {errors.country && (
              <FieldDescription className="text-red-400">
                {errors.country.message}
              </FieldDescription>
            )}
          </Field>
        </div>

        {/* ---------- Email Input Field ---------- */}
        <Field>
          <FieldLabel htmlFor="email" className="text-foreground">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="Enter your email"
            className="bg-background border-border focus:ring-2 focus:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <FieldDescription className="text-red-400">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/* ----------  Password Input Field  ---------- */}
        <Field>
          <FieldLabel htmlFor="password" className="text-foreground">
            Password
          </FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-background border-border focus:ring-2 focus:ring-primary pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground hover:text-primary transition"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {errors.password && (
            <FieldDescription className="text-red-400">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        {/* ----------  Confirm Password Input Field  ---------- */}
        <Field>
          <FieldLabel htmlFor="confirmPassword" className="text-foreground">
            Confirm Password
          </FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="bg-background border-border focus:ring-2 focus:ring-primary pr-12"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground hover:text-primary transition"
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {errors.confirmPassword && (
            <FieldDescription className="text-red-400">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>

        {/*  ---------- Submit Button  ---------- */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-secondary transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Sign up
        </Button>
      </form>
    </section>
  );
}
