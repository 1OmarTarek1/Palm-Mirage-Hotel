import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import { emailValidator } from "@/features/auth/authSchema";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";

const emailSchema = z.object({
  email: emailValidator,
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (formData) => {
    try {
      console.log(formData);
      await axiosInstance.patch("/auth/forgot-password", formData);
      toast.success(
        "Password reset successful. Please check your email for further instructions.",
      );
      navigate("/auth/reset-password");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* -------------------- Header Section  -------------------- */}
      <AuthHeader
        title="Forgot Password"
        description="Enter your email to receive a reset link"
        questionText="Remember your password?"
        linkText="Login"
        linkTo="/login"
      />

      {/* -------------------- Forgot Password Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- Email Input Field ---------- */}
        <FormInputField register={register("email")} error={errors.email} />

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Send mail</AuthButton>
      </form>
    </section>
  );
}
