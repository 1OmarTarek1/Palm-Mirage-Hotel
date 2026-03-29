import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { axiosPrivate } from "@/services/axiosInstance";
import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordField from "@/components/auth/PasswordField";
import { changePasswordSchema } from "@/features/auth/authSchema";
import { selectAccessToken } from "@/store/slices/authSlice";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  
  // Try Redux state first, fallback to Cookie, then LocalStorage
  const reduxToken = useSelector(selectAccessToken);
  const accessToken = reduxToken || Cookies.get("accessToken") || localStorage.getItem("token") || "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");
    
    // Safety check just in case the user has been fully logged out
    if (!accessToken) {
      toast.error("You are not logged in. Please login first.");
      navigate("/auth/login");
      return;
    }

    try {
      // Backend expects oldPassword, newPassword, and confirmationPassword
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmNewPassword,
      };

      await axiosPrivate.patch("/auth/change-password", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send valid token to pass backend authentication()
        },
      });
      
      toast.success("Password changed successfully!");
      navigate("/profile"); 
    } catch (error) {
      const respData = error.response?.data;
      let msg = respData?.message || "Failed to change password. Please try again.";
      
      // If backend sends specific joi validation details, show the first one
      if (respData?.details && respData.details.length > 0) {
        msg = respData.details[0].message;
      }
      
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Change Password"
        description="Update your password to keep your account secure."
        questionText="Want to go back?"
        linkText="Cancel"
        linkTo="/profile"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <PasswordField
          id="oldPassword"
          label="Old Password"
          placeholder="Enter current password"
          register={register("oldPassword")}
          error={errors.oldPassword}
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          register={register("newPassword")}
          error={errors.newPassword}
        />

        <PasswordField
          id="confirmNewPassword"
          label="Confirm New Password"
          placeholder="Re-enter new password"
          register={register("confirmNewPassword")}
          error={errors.confirmNewPassword}
        />

        {serverError && (
          <p className="text-sm text-red-500 text-center">{serverError}</p>
        )}

        <AuthButton isSubmitting={isSubmitting}>Change Password</AuthButton>
      </form>
    </section>
  );
}
