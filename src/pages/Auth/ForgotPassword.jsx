import z from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { emailValidator } from "./authSchema";
import AuthButton from "../../components/auth/AuthButton";

const emailSchema = z.object({
  email: emailValidator
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* -------------------- Header Section  -------------------- */}
      <div className="flex flex-col gap-2 text-center">
        <h4 className="text-2xl font-bold text-foreground">Forgot Password</h4>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a reset link
        </p>
        <p className="text-sm text-muted-foreground">
          Remember your password?
          <Link
            to="/auth/login"
            className="text-primary font-medium hover:text-secondary transition ml-1"
          >
            Login
          </Link>
        </p>
      </div>

      {/* -------------------- Forgot Password Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- Email Input Field ---------- */}
        <Field>
          <FieldLabel htmlFor="email" className="text-foreground">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="Enter your email"
            className="bg-background border-border focus:ring-2 focus:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <FieldDescription className="text-red-400">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/*  ---------- Submit Button  ---------- */}
         <AuthButton isSubmitting={isSubmitting}>Send mail</AuthButton>
      </form>
    </section>
  );
}