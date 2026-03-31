import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "@/services/axiosInstance";
import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import { setCredentials } from "@/store/slices/authSlice";
import FormInputField from "@/components/auth/FormInputField";
import { ConfirmEmailSchema } from "@/features/auth/authSchema";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: state?.data?.email || "", code: "" },
    resolver: zodResolver(ConfirmEmailSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await axiosInstance.patch("/auth/confirm-email", {
        ...formData,
        ...state,
      });
      console.log( {
        ...formData,
        ...state,
      })

      // dispatch(
      //   setCredentials({
      //     user: profileResponse?.data?.data?.user ?? null,
      //   }),
      // );

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
          label="code"
          placeholder="Enter 4-digit code"
          register={register("code")}
          error={errors.code}
        />

        <AuthButton isSubmitting={isSubmitting}>Confirm Email</AuthButton>
      </form>
    </section>
  );
}
