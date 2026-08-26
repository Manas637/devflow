export const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite: "strict",

  path: "/",

  priority: "high",
});