import { z } from "zod/v4";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(
    /^[A-Za-z0-9_\-.]+$/,
    "Username can only contain letters, numbers, dots, dashes, and underscores"
  );

export const emailSchema = z.email("Invalid email address").max(100, "Maximum 100 characters");

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
  day: z.string().min(1, "Day is required"),
  month: z.string("Month is required"),
  year: z.string().min(1, "Year is required"),
});
