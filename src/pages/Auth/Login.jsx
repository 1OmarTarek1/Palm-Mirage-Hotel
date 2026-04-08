import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasswordField from "@/components/auth/PasswordField";
import { loginSchema } from "@/features/auth/authSchema";
import { setCredentials } from "@/store/slices/authSlice";
import axiosInstance from "@/services/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: location.state?.email ?? "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const authData = response?.data?.data ?? {};
      const accessToken = authData?.accessToken ?? authData?.token?.accessToken ?? null;
      const refreshToken = authData?.refreshToken ?? authData?.token?.refreshToken ?? null;
      
      dispatch(
        setCredentials({
          user: authData?.user ?? null,
          token: accessToken,
          refreshToken,
        }),
      );

      if (!accessToken) {
        throw new Error("Login succeeded without access token. Please try again.");
      }

      toast.success("Signed in successfully.");
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      const shouldConfirmEmail = /verify|confirm/i.test(message);

      if (shouldConfirmEmail) {
        navigate("/auth/confirm-email", {
          replace: true,
          state: { email: formData.email },
        });
      }

      toast.error(message);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Welcome Back"
        description="Sign in to continue to your account"
        questionText="Don't have an account?"
        linkText="Register"
        linkTo="/register"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormInputField register={register("email")} error={errors.email} />

        <PasswordField
          register={register("password")}
          error={errors.password}
        />

        <Link
          to="/auth/forgot-password"
          className="text-sm text-left text-muted-foreground hover:text-primary hover:underline cursor-pointer transition focus:outline-primary"
        >
          Forgot your password?
        </Link>

        <AuthButton isSubmitting={isSubmitting}>Login</AuthButton>
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

