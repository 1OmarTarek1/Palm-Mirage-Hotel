import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Lock, Trash2, TriangleAlert, User as UserIcon, X } from "lucide-react";
import { toggleTheme, selectIsDark } from "@/store/slices/themeSlice";
import { logout, setCredentials } from "@/store/slices/authSlice";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import AppModal from "@/components/common/AppModal";
import { ChangePasswordModal, EditProfileModal } from "@/components/profile/ProfileAccountModals";
import LanguageToggle from "@/components/common/Navbar/LanguageToggle";
import { toast } from "react-toastify";

const MotionDiv = motion.div;
const MotionHeading = motion.h1;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 },
  }),
};

export default function Settings() {
  const { user, isAuthenticated, isHydrating } = useSelector((s) => s.auth);
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) return;

    setIsDeletingAccount(true);
    try {
      await axiosPrivate.patch("/user/profile/deleteAccount");
      await axiosInstance.post("/auth/logout").catch(() => null);
      dispatch(logout());
      toast.success("Your account has been deleted successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isHydrating) return null;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <MotionHeading
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground mb-8"
      >
        Settings
      </MotionHeading>

      <div className="space-y-4">
        <MotionDiv
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your account profile and photo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditProfileModalOpen(true)}
            className="cursor-pointer px-4 py-2 text-xs font-medium rounded-xl border border-border/50 text-foreground/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            Edit
          </button>
        </MotionDiv>

        {/* Language */}
        <MotionDiv
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
        >
          <LanguageToggle settingsCard />
        </MotionDiv>

        {/* Theme Toggle */}
        <MotionDiv
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Appearance</p>
              <p className="text-xs text-muted-foreground">
                {isDark ? "Dark mode" : "Light mode"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`relative w-12 h-7 cursor-pointer rounded-full transition-colors duration-300 ${
              isDark ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </MotionDiv>

        {/* Change Password - only for system users */}
        {user?.provider === "system" && (
          <MotionDiv
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="cursor-pointer px-4 py-2 text-xs font-medium rounded-xl border border-border/50 text-foreground/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              Change
            </button>
          </MotionDiv>
        )}

        {/* Danger Zone */}
        <MotionDiv
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-red-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-500">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your data</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer px-4 py-2 text-xs font-medium rounded-xl border border-red-500/30 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            Delete
          </button>
        </MotionDiv>
      </div>

      <AppModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        layout="account"
        tone="danger"
        zIndex={120}
        tintClassName="bg-black/50 p-0 backdrop-blur-sm"
        maxWidthClassName="sm:max-w-md"
        maxHeightClassName="sm:max-h-[min(90dvh,40rem)]"
        hideCloseButton
        header={
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-500/12 to-red-500/4 text-red-500 shadow-sm">
                <TriangleAlert size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-foreground">Delete Account</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This action will remove access to your account and sign you out immediately. You won't be able to use the same session again.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
        }
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="palmSecondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="palmPrimary"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        }
      >
        <div className="mt-2 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-muted-foreground">
          Saved rooms, cart items, and access to future bookings from this account will no longer be available from your profile.
        </div>
      </AppModal>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        axiosPrivate={axiosPrivate}
        submitLabel="Update"
        onProfileUpdated={(updatedUser) =>
          dispatch(setCredentials({ user: updatedUser, skipCollectionsSync: true }))
        }
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        submitLabel="Update"
      />
    </section>
  );
}
