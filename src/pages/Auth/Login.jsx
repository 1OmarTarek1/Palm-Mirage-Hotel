import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import FormInputField from "@/components/auth/FormInputField";
import { loginSchema } from "@/features/auth/authSchema";

export default function Login() {
  const navigate = useNavigate()
  
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
      navigate("/")
    } catch (error) {
      console.log(error);
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
          className="text-sm text-left text-muted-foreground hover:text-primary hover:underline cursor-pointer transition"
        >
          Forgot your password?
        </Link>

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>
      </form>
    </section>
  );
}
