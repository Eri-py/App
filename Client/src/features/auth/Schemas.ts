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
  .string("Invalid password")
  .min(8, "Invalid password")
  .max(64, "Invalid password")
  .regex(/[A-Z]/, "Invalid password")
  .regex(/[a-z]/, "Invalid password")
  .regex(/[0-9]/, "Invalid password")
  .regex(/[#?!@$%^&\-.]/, "Invalid password")
  .regex(/^[A-Za-z0-9#?!@$%^&\-.]+$/, "Invalid password");
