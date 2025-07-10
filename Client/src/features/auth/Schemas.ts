import { z } from "zod/v4";
import { parseISO, isValid } from "date-fns";

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
  .string("Password is required")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[#?!@$%^&\-._]/, "Password must contain at least one special character (#?!@$%^&-._)")
  .regex(/^[A-Za-z0-9#?!@$%^&\-._]+$/, "Password contains invalid characters")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be no more than 64 characters long");

export const nameSchema = (nameType: string) => {
  return z
    .string(`Invalid ${nameType}`)
    .trim()
    .nonempty(`${nameType} is required`)
    .max(64)
    .transform((val) => {
      if (val) return val[0].toUpperCase() + val.slice(1).toLowerCase();
      return val;
    });
};

export const padDate = (date: string) => {
  const [year, month, day] = date.split("-");

  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
};

export const dateSchema = z
  .string("Date is required")
  .refine((val) => {
    const normalizedDate = padDate(val);
    const parsedDate = parseISO(normalizedDate).getFullYear();
    const currentDate = new Date().getFullYear();
    if (isValid(parsedDate) && currentDate >= parsedDate) {
      return currentDate - parsedDate <= 150;
    }

    return false;
  }, "Invalid date")
  .transform((val) => padDate(val));
