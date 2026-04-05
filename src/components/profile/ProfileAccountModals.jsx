import { Calendar, Globe, Mail, Phone, Shield, User, VenusAndMars } from "lucide-react";

import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import AppModal from "@/components/common/AppModal";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

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
    <AppModal
      open={isOpen}
      onClose={onClose}
      layout="account"
      title="Account Details"
      subtitle="A quick view of the current information stored on your account."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {detailItems.map((item) => (
          <DetailRow key={item.label} {...item} />
        ))}
      </div>
    </AppModal>
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
    <AppModal
      open={isOpen}
      onClose={onClose}
      layout="account"
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
    </AppModal>
  );
}

export function ChangePasswordModal({ isOpen, onClose, submitLabel = "Update" }) {
  return (
    <AppModal
      open={isOpen}
      onClose={onClose}
      layout="account"
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
      />
    </AppModal>
  );
}
