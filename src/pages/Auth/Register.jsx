import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import FormInputField from "@/components/auth/FormInputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { registerSchema } from "@/features/auth/authSchema";
import axiosInstance from "@/services/axiosInstance";

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

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

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      await axiosInstance.post("/auth/signup", formData);
      toast.success("Account created successfully. Please log in.");
      navigate("/auth/login", {
        replace: true,
        state: { email: formData.email },
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* -------------------- Header Section  -------------------- */}
      <AuthHeader
        title="Create Account"
        description="Sign up to get started"
        questionText="Already have an account?"
        linkText="Login"
        linkTo="/login"
      />

      {/* -------------------- Sign up Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- User Name Input Field ---------- */}
        <FormInputField
          type="text"
          id="userName"
          label="User Name"
          placeholder="Enter your Name"
          register={register("userName")}
          error={errors.userName}
        />

        {/* ---------- Phone & Country Fields ---------- */}
        <div className="flex flex-wrap md:flex-nowrap  gap-2">
          {/* ---------- Phone Number Input Field ---------- */}
          <FormInputField
            type="text"
            id="phoneNumber"
            label="Phone Number"
            placeholder="Enter your phone"
            register={register("phoneNumber")}
            error={errors.phoneNumber}
          />

          {/* ---------- Country Input Field ---------- */}
          <FormInputField
            type="text"
            id="country"
            label="Country"
            placeholder="Enter your Country"
            register={register("country")}
            error={errors.country}
          />
        </div>

        {/* ---------- Email Input Field ---------- */}
        <FormInputField register={register("email")} error={errors.email} />

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

        {serverError && (
          <p className="text-sm text-red-500 text-center">{serverError}</p>
        )}

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Sign up</AuthButton>
      </form>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <GoogleAuthButton />
    </section>
  );
}
