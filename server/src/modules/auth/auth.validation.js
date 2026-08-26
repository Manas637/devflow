import { z } from "zod";

import { PASSWORD_REGEX } from "../../constants/regex.js";

export const registerSchema = z.object({
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
}).strict();

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

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
}).strict();

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
}).strict();

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
}).strict();