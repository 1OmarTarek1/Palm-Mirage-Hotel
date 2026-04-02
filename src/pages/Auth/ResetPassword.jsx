import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import FormInputField from "@/components/auth/FormInputField";
import { resetPasswordSchema } from "@/features/auth/authSchema";
import axiosInstance from "@/services/axiosInstance";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
      email: state?.data?.email || "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await axiosInstance.patch("/auth/reset-password", {
        ...formData,
        ...state,
      });
      toast.success(
        "Password reset successful. Please check your email for further instructions.",
      );
      navigate("/auth/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. We couldn't reset your password. Please try again.";
      toast.error(message);
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
          id="code"
          label="code"
          placeholder="Enter 4-digit code"
          register={register("code")}
          error={errors.code}
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
