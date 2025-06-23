import { z } from "zod";

export const genericTextSchema = (fieldLabel: string) =>
  z.string().min(1, `Please enter a ${fieldLabel}`).max(100, "Maximum 100 characters");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(
    /^[A-Za-z0-9_\-.]+$/,
    "Username can only contain letters, numbers, dots, dashes, and underscores"
  );

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(100, "Maximum 100 characters")
  .email("Invalid email address");

export const otpSchema = z.string().length(5, "Invalid code");

export const passwordSchema = z
  .string()
  .min(8, "Password must be greater than 8 characters")
  .max(64, "Password must be less than 15 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[#?!@$%^&\-.]/, "Password must contain at least one special character")
  .regex(/^[A-Za-z0-9#?!@$%^&\-.]+$/, "Password contains invalid characters");

export const dateOfBirthSchema = z.string().refine(
  (value) => {
    const inputDate = new Date(value);
    const now = new Date();

    if (isNaN(inputDate.getTime())) {
      return false;
    }

    // Calculate age more reliably
    const age = now.getFullYear() - inputDate.getFullYear();
    const monthDiff = now.getMonth() - inputDate.getMonth();
    const dayDiff = now.getDate() - inputDate.getDate();

    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    return actualAge >= 13;
  },
  { message: "You must be at least 13 years old." }
);
