import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import { registerSchema } from "./authSchema";
import AuthButton from "../../components/auth/AuthButton";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordField from "../../components/auth/PasswordField";
import FormInputField from "../../components/auth/FormInputField";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      userName: "",
      phoneNumber: "",
      country: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
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
      <AuthHeader
        title="Create Account"
        description="Sign up to get started"
        questionText="Already have an account?"
        linkText="Login"
        linkTo="/login"
      />

      {/* -------------------- Sign up Form --------------------  */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ---------- User Name Input Field ---------- */}
        <Field>
          <FieldLabel htmlFor="userName" className="text-foreground">
            User Name
          </FieldLabel>
          <Input
            id="userName"
            type="text"
            placeholder="Enter your Name"
            className="bg-background border-border focus:ring-2 focus:ring-primary py-6"
            {...register("userName")}
          />
          {errors.userName && (
            <FieldDescription className="text-red-400">
              {errors.userName.message}
            </FieldDescription>
          )}
        </Field>

        {/* ---------- Phone & Country Fields ---------- */}
        <div className="flex gap-2">
          {/* ---------- Phone Number Input Field ---------- */}
          <Field>
            <FieldLabel htmlFor="phoneNumber" className="text-foreground">
              Phone Number
            </FieldLabel>
            <Input
              id="phoneNumber"
              type="text"
              placeholder="Enter your phone"
              className="bg-background border-border focus:ring-2 focus:ring-primary py-6"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <FieldDescription className="text-red-400">
                {errors.phoneNumber.message}
              </FieldDescription>
            )}
          </Field>

          {/* ---------- Country Input Field ---------- */}
          <Field>
            <FieldLabel htmlFor="country" className="text-foreground">
              Country
            </FieldLabel>
            <Input
              id="country"
              type="text"
              placeholder="Enter your Country"
              className="bg-background border-border focus:ring-2 focus:ring-primary py-6"
              {...register("country")}
            />
            {errors.country && (
              <FieldDescription className="text-red-400">
                {errors.country.message}
              </FieldDescription>
            )}
          </Field>
        </div>

        {/* ---------- Email Input Field ---------- */}
        <FormInputField
          register={register("email")}
          error={errors.email}
        />

        {/* ----------  Password Input Field  ---------- */}
        <PasswordField
          register={register("password")}
          error={errors.password}
        />

        {/* ----------  Confirm Password Input Field  ---------- */}

        <PasswordField
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        {/*  ---------- Submit Button  ---------- */}
        <AuthButton isSubmitting={isSubmitting}>Sign up</AuthButton>
      </form>
    </section>
  );
}
