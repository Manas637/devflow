import { z } from "zod";

import { PASSWORD_REGEX } from "./regex";

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(1, "Password is required."),
  })
  .strict();

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(
        PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),

    confirmPassword: z.string(),
  })
  .strict()
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(
        PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );