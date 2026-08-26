import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many login attempts. Please try again later.",
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many registration attempts. Please try again later.",
  },
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many password reset requests. Please try again later.",
  },
});

export const resendVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many verification email requests. Please try again later.",
  },
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many refresh requests. Please try again later.",
  },
});