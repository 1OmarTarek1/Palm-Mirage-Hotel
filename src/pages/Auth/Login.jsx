import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import FormInputField from "@/components/auth/FormInputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { loginSchema } from "@/features/auth/authSchema";
import { fetchUserProfile } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE}/auth/login`,
        formData
      );

      Cookies.set("accessToken", data.data.accessToken, {
        expires: 10,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", data.data.refreshToken, {
        expires: 365,
        secure: true,
        sameSite: "Strict",
      });

      await dispatch(fetchUserProfile()).unwrap();
      toast.success("Welcome back! You're now logged in.");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* -------------------- Header Section  -------------------- */}
      <AuthHeader
        title="Welcome Back"
        description="Sign in to continue to your account"
        questionText="Don’t have an account?"
        linkText="Register"
        linkTo="/register"
      />

      {/* -------------------- Login Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- Email Input Field ---------- */}
        <FormInputField
          register={register("email")}
          error={errors.email}
        />

        {/* ----------  Password Input Field  ---------- */}
        <PasswordField
          register={register("password")}
          error={errors.password}
        />

        {/* ----------Forgot Password Link ---------- */}
        <Link
          to="/auth/forgot-password"
          className="text-sm text-left text-muted-foreground hover:text-primary hover:underline cursor-pointer transition focus:outline-primary"
        >
          Forgot your password?
        </Link>

        {serverError && (
          <p className="text-sm text-red-500 text-center">{serverError}</p>
        )}

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>
      </form>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <GoogleAuthButton mode="login" />
    </section>
  );
}
