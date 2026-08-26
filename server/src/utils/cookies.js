import { AUTH } from "../constants/auth.constants.js";
import { COOKIE_OPTIONS } from "../constants/cookie.constants.js";

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: AUTH.REFRESH_TOKEN_COOKIE_MAX_AGE,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
};