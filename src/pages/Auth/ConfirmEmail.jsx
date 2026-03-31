import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import { ConfirmEmailSchema } from "@/features/auth/authSchema";
import axiosInstance from "@/services/axiosInstance";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialEmail = state?.email || state?.data?.email || "";

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

      toast.success("Signed in successfully.");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Confirm Your Email"
        description="Enter the 4-digit verification code sent to your email to activate your account"
        questionText="Didn't receive the code?"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <FormInputField
          type="text"
          id="code"
          label="Code"
          placeholder="Enter 4-digit code"
          register={register("code")}
          error={errors.code}
        />

        <AuthButton isSubmitting={isSubmitting}>Confirm Email</AuthButton>
      </form>
    </section>
  );
}
