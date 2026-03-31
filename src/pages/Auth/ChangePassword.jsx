import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { axiosPrivate } from "@/services/axiosInstance";
import AuthButton from "@/components/auth/AuthButton";
import PasswordField from "@/components/auth/PasswordField";
import { changePasswordSchema } from "@/features/auth/authSchema";
import { selectAccessToken } from "@/store/slices/authSlice";

export default function ChangePassword({ isOpen, onClose }) {
  const [serverError, setServerError] = useState("");

  const reduxToken = useSelector(selectAccessToken);
  const accessToken =
    reduxToken ||
    Cookies.get("accessToken") ||
    localStorage.getItem("token") ||
    "";

  const {
    register,
    handleSubmit,
    reset,
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

    if (!accessToken) {
      toast.error("You are not logged in. Please login first.");
      onClose();
      return;
    }

    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmNewPassword,
      };

      await axiosPrivate.patch("/auth/change-password", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("Password changed successfully!");
      reset();
      onClose();
    } catch (error) {
      const respData = error.response?.data;

      let msg =
        respData?.message ||
        "Failed to change password. Please try again.";

      if (respData?.details && respData.details.length > 0) {
        msg = respData.details[0].message;
      }

      setServerError(msg);
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative transform transition-all animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button ('X') */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-8 text-center sm:text-left pt-2">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
            Change Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <PasswordField
            id="oldPassword"
            label="Current Password"
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
            <p className="text-sm font-medium text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {serverError}
            </p>
          )}

          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95"
            >
              Cancel
            </button>
            <div className="flex-1">
              <AuthButton isSubmitting={isSubmitting}>
                Save Changes
              </AuthButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
