import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import { emailValidator } from "@/features/auth/authSchema";

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

  const onSubmit = (data) => {
    try {
      console.log(data);
      navigate("/auth/reset-password");
    } catch (error) {
      console.log(error);
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
