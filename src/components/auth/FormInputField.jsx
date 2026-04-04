import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function FormInputField({
  id = "email",
  label = "Email",
  type = "text",
  placeholder = "Enter your email",
  autoComplete,
  register,
  error,
  className,
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
        autoComplete={autoComplete ?? (id === "email" ? "email" : undefined)}
        className={cn(
          "md:py-6",
          className,
        )}
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
