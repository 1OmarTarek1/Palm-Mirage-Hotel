import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import { ConfirmEmailSchema } from "@/features/auth/authSchema";
import { setCredentials } from "@/store/slices/authSlice";
import axiosInstance from "@/services/axiosInstance";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const initialEmail = state?.email || state?.data?.email || "";
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: initialEmail, code: "" },
    resolver: zodResolver(ConfirmEmailSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const payload = {
        email: formData.email || initialEmail,
        code: formData.code,
      };

      await axiosInstance.patch("/auth/confirm-email", payload);

      const password = state?.password;
      if (password) {
        const loginResponse = await axiosInstance.post("/auth/login", {
          email: payload.email,
          password,
        });

        dispatch(
          setCredentials({
            user: loginResponse?.data?.data?.user ?? null,
            token: loginResponse?.data?.data?.accessToken ?? null,
            refreshToken: loginResponse?.data?.data?.refreshToken ?? null,
          }),
        );
        toast.success("Email confirmed successfully.");
        navigate("/profile", { replace: true });
        return;
      }

      toast.success("Email confirmed successfully. Please login to continue.");
      navigate("/auth/login", {
        replace: true,
        state: { email: payload.email },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email confirmation failed. Please try again.",
      );
    }
  };

  const handleResendCode = async (email) => {
    if (resendCooldown > 0 || isResending) return;

    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-confirm-email", { email });
      toast.success("A new verification code has been sent to your email.");
      setResendCooldown(60);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code.",
      );
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Confirm Your Email"
        description="Enter the 4-digit verification code sent to your email to activate your account"
        questionText="Didn't receive the code?"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormInputField
          type="email"
          id="email"
          label="Email"
          placeholder="Enter your email"
          register={register("email")}
          error={errors.email}
        />

        <FormInputField
          type="text"
          id="code"
          label="Code"
          placeholder="Enter 4-digit code"
          register={register("code")}
          error={errors.code}
        />

        <AuthButton isSubmitting={isSubmitting}>Confirm Email</AuthButton>
        <button
          type="button"
          disabled={isResending || resendCooldown > 0}
          onClick={handleSubmit((values) => handleResendCode(values.email || initialEmail))}
          className="cursor-pointer text-sm text-primary hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isResending
            ? "Sending..."
            : resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend code"}
        </button>
      </form>
    </section>
  );
}