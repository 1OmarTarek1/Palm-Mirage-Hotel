import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasswordField from "@/components/auth/PasswordField";
import { loginSchema } from "@/features/auth/authSchema";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    console.log(formData);
     navigate(from, { replace: true });
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
        <FormInputField register={register("email")} error={errors.email} />

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
