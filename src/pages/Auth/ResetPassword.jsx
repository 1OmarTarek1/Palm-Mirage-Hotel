import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "../../components/auth/AuthButton";
import { resetPasswordSchema } from "./authSchema";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordField from "../../components/auth/PasswordField";

export default function ResetPassword() {
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
      <AuthHeader
        title="Reset Password"
        description="Enter the code sent to your email and set a new password"
        questionText="Back to"
        linkText="Login"
        linkTo="/login"
      />

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
            className="bg-background border-border focus:ring-2 focus:ring-primary py-6"
            {...register("otp")}
          />
          {errors.otp && (
            <FieldDescription className="text-red-400">
              {errors.otp.message}
            </FieldDescription>
          )}
        </Field>

        {/* ----------  Password Input Field  ---------- */}
        <PasswordField
          register={register("password")}
          error={errors.password}
        />

        {/* ----------  Confirm Password Input Field  ---------- */}
        <PasswordField
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Reset</AuthButton>
      </form>
    </section>
  );
}
