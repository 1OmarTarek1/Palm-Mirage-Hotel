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
        successDelayMs={1400}
        successTitle="Password changed"
        successMessage="Nice. We are signing you out now so you can log in with the new password."
        toastMessage="Password changed successfully. Redirecting you to login."
      />
    </section>
  );
}
