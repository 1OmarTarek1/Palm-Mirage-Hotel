import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInputField from "@/components/auth/FormInputField";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasswordField from "@/components/auth/PasswordField";
import { loginSchema } from "@/features/auth/authSchema";
import { setCredentials } from "@/store/slices/authSlice";
import axiosInstance from "@/services/axiosInstance";

const getCookieOptions = () => ({
  expires: 10,
  secure: window.location.protocol === "https:",
  sameSite: "Lax",
});

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
    defaultValues: { email: "mohamedahmedkhalaf68@gmail.com", password: "moAhmed123" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      const accessToken = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;

      Cookies.set("accessToken", accessToken, getCookieOptions());
      Cookies.set("refreshToken", refreshToken, {
        ...getCookieOptions(),
        expires: 365,
      });

      const profileResponse = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(
        setCredentials({
          user: profileResponse?.data?.data?.user ?? null,
          accessToken,
        }),
      );

      toast.success("Signed in successfully.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
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

      <GoogleAuthButton mode="login" />
    </section>
  );
}
