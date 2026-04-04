import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

export default function PasswordField({
  id = "password",
  label = "Password",
  placeholder = "Enter your password",
  autoComplete = "current-password",
  register,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-foreground">
        {label}
      </FieldLabel>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="pr-12 md:py-6"
          {...register}
        />

        <button
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary transition bg-transparent focus:outline-primary"
        >
          <span className="sr-only">
            {showPassword ? "hide password" : "show password"}
          </span>
          {showPassword ? (
            <Eye className="focus:border-0" size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>
      </div>

      {error && (
        <FieldDescription className="text-red-400">
          {error.message}
        </FieldDescription>
      )}
    </Field>
  );
}
