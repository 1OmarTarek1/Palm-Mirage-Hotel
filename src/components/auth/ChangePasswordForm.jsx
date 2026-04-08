import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/features/auth/authSchema";
import { cn } from "@/lib/utils";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axiosInstance from "@/services/axiosInstance";
import { logout } from "@/store/slices/authSlice";

const MotionDiv = motion.div;
const MotionH4 = motion.h4;
const MotionP = motion.p;
const MotionCircle = motion.circle;
const MotionPath = motion.path;

export default function ChangePasswordForm({
  onSuccess,
  onCancel,
  submitLabel = "Update Password",
  className,
  successTitle = "Password changed successfully",
  successMessage = "Choose whether to continue here or sign out from all devices and log in again.",
  toastMessage = "Password changed successfully.",
}) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);
  const [isFinalizingAction, setIsFinalizingAction] = useState(false);
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
    setShowSuccessNotice(false);

    try {
      await axiosPrivate.patch("/auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmPassword,
        logoutAllSessions: false,
      });

      toast.success(toastMessage);
      reset();
      setShowSuccessNotice(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change password. Please try again.",
      );
    }
  };

  const handleStaySignedIn = async () => {
    if (isFinalizingAction) return;
    setIsFinalizingAction(true);
    toast.success("Password updated. You are still signed in on this device.");
    onSuccess?.();
    onCancel?.();
    setIsFinalizingAction(false);
  };

  const handleLogoutAllSessions = async () => {
    if (isFinalizingAction) return;
    setIsFinalizingAction(true);
    try {
      await axiosPrivate.post("/auth/logout-all-sessions");
    } catch {
      // Continue local logout even if server-side global logout fails.
    }
    void axiosInstance.post("/auth/logout").catch(() => null).finally(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      dispatch(logout());
      onSuccess?.();
      navigate("/auth/login", { replace: true });
      setIsFinalizingAction(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex min-h-0 w-full flex-1 flex-col", className)}
    >
      {showSuccessNotice ? (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex flex-1 flex-col items-center justify-center rounded-[1.75rem] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_55%),linear-gradient(180deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))] px-6 py-10 text-center"
        >
          <MotionDiv
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex h-28 w-28 items-center justify-center rounded-full border border-emerald-500/20 bg-white/70 shadow-lg dark:bg-emerald-950/30"
          >
            <svg viewBox="0 0 120 120" className="h-20 w-20 text-emerald-600">
              <MotionCircle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
              <MotionPath
                d="M37 62 L53 78 L84 46"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.35, ease: "easeOut" }}
              />
            </svg>
          </MotionDiv>

          <MotionH4
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mt-8 text-2xl font-bold text-foreground"
          >
            {successTitle}
          </MotionH4>
          <MotionP
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.3 }}
            className="mt-3 max-w-md text-sm leading-6 text-muted-foreground"
          >
            {successMessage}
          </MotionP>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="palmSecondary"
              onClick={handleStaySignedIn}
              disabled={isFinalizingAction}
            >
              Continue here
            </Button>
            <Button
              type="button"
              variant="palmPrimary"
              onClick={handleLogoutAllSessions}
              disabled={isFinalizingAction}
            >
              Logout all devices
            </Button>
          </div>
        </MotionDiv>
      ) : (
        <>
          <div className="min-h-0 flex-1 space-y-4">
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
          </div>

          <div
            className={cn(
              "mt-auto flex shrink-0 flex-wrap gap-3 border-t border-border/30 bg-background/95 pt-4 pb-0",
              onCancel ? "justify-end" : "flex-col",
            )}
          >
            {onCancel ? (
              <Button type="button" variant="palmSecondary" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="palmPrimary"
              disabled={isSubmitting}
              className={onCancel ? undefined : "w-full"}
            >
              {isSubmitting ? (
                <>
                  Please wait...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
