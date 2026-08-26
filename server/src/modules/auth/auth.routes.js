import { Router } from "express";

import { authController, authMiddleware} from "../../container/auth.container.js";

import validate from "../../middleware/validate.middleware.js";

import {
  registerRateLimiter,
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resendVerificationRateLimiter,
  refreshRateLimiter
} from "../../middleware/rate-limit.middleware.js";

import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  registerRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  "/refresh",
  refreshRateLimiter,
  authController.refresh
);

router.get(
  "/verify-email",
  authController.verifyEmail
);

router.post(
  "/resend-verification",
  resendVerificationRateLimiter,
  validate(resendVerificationSchema),
  authController.resendVerificationEmail
);

router.get(
    "/me",
    authMiddleware,
    authController.me
);

router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  "/logout",
  authController.logout
);

router.post(
  "/logout-all",
  authMiddleware,
  authController.logoutAll
);

export default router;