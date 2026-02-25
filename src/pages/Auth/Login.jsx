import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import { loginSchema } from "./authSchema";
import AuthButton from "../../components/auth/AuthButton";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
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
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-2xl font-bold text-foreground">Welcome Back</h4>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to your account
        </p>
        <p className="text-sm text-muted-foreground">
          Don’t have an account?
          <Link
            to="/auth/register"
            className="text-primary font-medium hover:text-secondary transition"
          >
            Register
          </Link>
        </p>
      </div>

      {/* -------------------- Login Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- Email Input Field ---------- */}
        <Field>
          <FieldLabel htmlFor="email" className="text-foreground">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="Enter your email"
            className="bg-background border-border focus:ring-2 focus:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <FieldDescription className="text-red-400">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/* ----------  Password Input Field  ---------- */}
        <Field>
          <FieldLabel htmlFor="password" className="text-foreground">
            Password
          </FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="bg-background border-border focus:ring-2 focus:ring-primary pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground hover:text-primary transition"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {errors.password && (
            <FieldDescription className="text-red-400">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        {/* ----------Forgot Password Link ---------- */}
        <Link
          to="/auth/forgot-password"
          className="text-xs text-left text-muted-foreground hover:text-primary hover:underline cursor-pointer transition"
        >
          Forgot your password?
        </Link>

        {/*  ---------- Submit Button  ---------- */}
          <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>
      </form>
    </section>
  );
}