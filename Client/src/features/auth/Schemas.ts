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
  .string("Invalid password")
  .min(8, "Invalid password")
  .max(64, "Invalid password")
  .regex(/[A-Z]/, "Invalid password")
  .regex(/[a-z]/, "Invalid password")
  .regex(/[0-9]/, "Invalid password")
  .regex(/[#?!@$%^&\-.]/, "Invalid password")
  .regex(/^[A-Za-z0-9#?!@$%^&\-.]+$/, "Invalid password");

export const nameSchema = (nameType: string) => {
  return z.string(`Invalid ${nameType}`).trim().nonempty(`${nameType} is required`).max(64);
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

    const parsedDate = parseISO(normalizedDate);
    if (isValid(parsedDate)) {
      return new Date().getFullYear() - parsedDate.getFullYear() <= 150;
    }

    return false;
  }, "Invalid date")
  .transform((val) => padDate(val));
