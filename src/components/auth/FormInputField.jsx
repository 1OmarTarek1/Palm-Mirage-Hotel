import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function FormInputField({
  id="email",
  label="Email",
  type = "text",
  placeholder="Enter your email",
  register,
  error,
}) {
  return (
    <Field>
      {label && (
        <FieldLabel htmlFor={id} className="text-foreground">
          {label}
        </FieldLabel>
      )}

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="bg-background border-border focus:ring-2 focus:ring-primary py-6"
        {...register}
      />

      {error && (
        <FieldDescription className="text-red-400">
          {error.message}
        </FieldDescription>
      )}
    </Field>
  );
}
