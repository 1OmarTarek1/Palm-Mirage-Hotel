import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import { changePasswordSchema } from "@/features/auth/authSchema";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { logout } from "@/store/slices/authSlice";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await axiosPrivate.patch("/auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmPassword,
      });

      toast.success("Password changed successfully.");
      reset();
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password. Please try again."
      );
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Change Password"
        description="Update your account password to keep it secure"
        questionText="Back to dashboard?"
        linkText="Dashboard"
        linkTo="/"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <PasswordField
          id="old-password"
          label="Old Password"
          name="oldPassword"
          register={register("oldPassword")}
          error={errors.oldPassword}
          placeholder="Enter your current password"
        />

        <PasswordField
          id="new-password"
          label="New Password"
          name="newPassword"
          register={register("newPassword")}
          error={errors.newPassword}
          placeholder="Enter your new password"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm New Password"
          name="confirmPassword"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          placeholder="Confirm your new password"
        />

        <AuthButton isSubmitting={isSubmitting}>Update Password</AuthButton>
      </form>
    </section>
  );
}
