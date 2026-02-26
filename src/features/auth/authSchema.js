import z from "zod";

// -------------------
// Shared Validators
// -------------------

export const emailValidator = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" })
  .max(50, { message: "Email is too long" });

export const passwordValidator = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(50, { message: "Password is too long" })
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/,
    "Password must contain at least one letter and one number",
  );

// -------------------
// Schemas
// -------------------

// Login Schema
export const loginSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

// Register Schema
export const registerSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, { message: "User Name is required" })
      .max(30, { message: "User Name is too long" })
      .regex(/^[A-Za-z\s]+$/, "User Name can only contain letters and spaces"),

    phoneNumber: z
      .string()
      .trim()
      .min(10, { message: "Phone Number is required" })
      .max(15, { message: "Phone Number is too long" })
      .regex(
        /^\+?\d+$/,
        "Phone Number must contain only numbers and optional +",
      ),

    country: z
      .string()
      .trim()
      .min(2, { message: "Country is required" })
      .max(50, { message: "Country name is too long" }),

    email: emailValidator,
    password: passwordValidator,
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    otp: z
      .string({ required_error: "OTP is required" })
      .trim()
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
