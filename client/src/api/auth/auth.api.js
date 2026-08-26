import api from "@/api/axios";

export const register = (data) =>
  api.post("/auth/register", data);

export const login = (data) =>
  api.post("/auth/login", data);

export const refresh = () =>
  api.post("/auth/refresh");

export const getCurrentUser = () =>
  api.get("/auth/me");

export const logout = () =>
  api.post("/auth/logout");

export const logoutAll = () =>
  api.post("/auth/logout-all");

export const verifyEmail = (token) =>
  api.get("/auth/verify-email", {
    params: {
      token,
    },
  });

export const resendVerification = (data) =>
  api.post("/auth/resend-verification", data);

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);