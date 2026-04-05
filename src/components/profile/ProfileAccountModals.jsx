import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Globe, Mail, Phone, Shield, User, VenusAndMars, X } from "lucide-react";

import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

const MotionDiv = motion.div;

function ModalShell({ isOpen, title, subtitle, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex flex-col bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
          onClick={onClose}
        >
          <MotionDiv
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-none border border-border/60 bg-background/95 shadow-2xl sm:h-auto sm:max-h-[min(90dvh,56rem)] sm:max-w-2xl sm:flex-none sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-border/40 px-6 pt-6 pb-4 sm:border-0 sm:pb-0">
              <div className="min-w-0 pr-2">
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                {subtitle ? (
                  <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
              <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onClose}>
                <X size={18} />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
              {children}
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

function DetailRow({ icon, label, value }) {
  const Icon = icon;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}

export function AccountDetailsModal({ isOpen, onClose, user }) {
  const detailItems = [
    { icon: User, label: "User Name", value: user?.userName },
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Globe, label: "Country", value: user?.country },
    {
      icon: VenusAndMars,
      label: "Gender",
      value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "",
    },
    { icon: Phone, label: "Phone", value: user?.phoneNumber },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: user?.DOB ? new Date(user.DOB).toLocaleDateString() : "",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    },
    {
      icon: Shield,
      label: "Role",
      value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "",
    },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Account Details"
      subtitle="A quick view of the current information stored on your account."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {detailItems.map((item) => (
          <DetailRow key={item.label} {...item} />
        ))}
      </div>
    </ModalShell>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
  axiosPrivate,
  onProfileUpdated,
  submitLabel = "Save Changes",
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update the information you want reflected across your account."
    >
      <ProfileEditForm
        user={user}
        axiosPrivate={axiosPrivate}
        onProfileUpdated={onProfileUpdated}
        onSaved={() => onClose()}
        onCancel={onClose}
        submitLabel={submitLabel}
        className="space-y-5"
      />
    </ModalShell>
  );
}

export function ChangePasswordModal({ isOpen, onClose, submitLabel = "Update" }) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      subtitle="Update your account password from here without leaving the settings page."
    >
      <ChangePasswordForm
        onCancel={onClose}
        submitLabel={submitLabel}
        successDelayMs={1200}
        successTitle="Password changed"
        successMessage="Everything looks good. We are signing you out so you can log in again safely."
        toastMessage="Password changed successfully. Your new password is ready to use."
        className="space-y-5"
      />
    </ModalShell>
  );
}
