import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import FormInputField from "@/components/auth/FormInputField";
import { resetPasswordSchema } from "@/features/auth/authSchema";

export default function ResetPassword() {
  const navigate = useNavigate();

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
      navigate("/auth/login");
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
        <FormInputField
          type="text"
          id="otp"
          label="OTP"
          placeholder="Enter 6-digit code"
          register={register("otp")}
          error={errors.otp}
        />

        {/* ----------  Password Input Field  ---------- */}
        <PasswordField
          register={register("password")}
          error={errors.password}
        />

        {/* ----------  Confirm Password Input Field  ---------- */}
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Reset</AuthButton>
      </form>
    </section>
  );
}
