import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "../../components/auth/AuthButton";
import { resetPasswordSchema } from "./authSchema";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { otp: "", password: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
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
        <h4 className="text-2xl font-bold text-foreground">Reset Password</h4>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to your email and set a new password
        </p>
        <p className="text-sm text-muted-foreground">
          Back to
          <Link
            to="/auth/login"
            className="text-primary font-medium hover:text-secondary transition ml-1"
          >
            Login
          </Link>
        </p>
      </div>

      {/* -------------------- Reset Password Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ----------  OTP Input Field  ---------- */}
        <Field>
          <FieldLabel htmlFor="otp" className="text-foreground">
            OTP Code
          </FieldLabel>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            className="bg-background border-border focus:ring-2 focus:ring-primary"
            {...register("otp")}
          />
          {errors.otp && (
            <FieldDescription className="text-red-400">
              {errors.otp.message}
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
              placeholder="Enter new password"
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
        <AuthButton isSubmitting={isSubmitting}>Reset</AuthButton>
      </form>
    </section>
  );
}
