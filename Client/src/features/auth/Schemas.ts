import { z } from "zod";

export const genericTextSchema = (fieldLabel: string) =>
  z.string().min(1, `Please enter ${fieldLabel}`).max(100, "Maximum 100 characters");

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

export const otpSchema = z.string().length(6, "Invalid code");

export const passwordSchema = z
  .string()
  .min(8, "Invalid Password")
  .max(64, "Invalid Password")
  .regex(/[A-Z]/, "Invalid Password")
  .regex(/[a-z]/, "Invalid Password")
  .regex(/[0-9]/, "Invalid Password")
  .regex(/[#?!@$%^&\-.]/, "Invalid Password")
  .regex(/^[A-Za-z0-9#?!@$%^&\-.]+$/, "Invalid Password");

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
