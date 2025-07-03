import { z } from "zod";

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

export const passwordSchema = z
  .string()
  .min(8, "Invalid Password")
  .max(64, "Invalid Password")
  .regex(/[A-Z]/, "Invalid Password")
  .regex(/[a-z]/, "Invalid Password")
  .regex(/[0-9]/, "Invalid Password")
  .regex(/[#?!@$%^&\-.]/, "Invalid Password")
  .regex(/^[A-Za-z0-9#?!@$%^&\-.]+$/, "Invalid Password");

export const dateSchema = z.object({
  day: z.string(),
  month: z.string(),
  year: z.string(),
});
