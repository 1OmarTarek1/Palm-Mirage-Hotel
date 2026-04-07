import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import AuthHeader from "@/components/auth/AuthHeader";

export default function ChangePassword() {
  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      <AuthHeader
        title="Change Password"
        description="Update your account password to keep it secure"
        questionText="Back to dashboard?"
        linkText="Dashboard"
        linkTo="/"
      />

      <ChangePasswordForm
        submitLabel="Update Password"
        successTitle="Password changed"
        successMessage="Choose whether to keep this session active or sign out from all devices."
        toastMessage="Password changed successfully."
      />
    </section>
  );
}
