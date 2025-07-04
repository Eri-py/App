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

const daySchema = z
  .string()
  .min(1, "Day is required")
  .max(2, "Invalid day")
  .refine((val) => {
    const day = Number(val);
    return !isNaN(day) && day >= 1 && day <= 31;
  }, "Invalid day");

const monthSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(`1 ${val} 2000`)), "Invalid month");

const yearSchema = z.string().refine((val) => {
  const year = Number(val);
  const age = new Date().getFullYear() - year;
  return !isNaN(year) && val.length === 4 && age >= 0 && age <= 120;
}, "Invalid year");

export const dateSchema = z.object({
  day: daySchema,
  month: monthSchema,
  year: yearSchema,
});
