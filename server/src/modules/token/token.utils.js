import crypto from "crypto";

export function generateToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export function getTokenExpiry(type, expiryMap) {
  return new Date(Date.now() + expiryMap[type]);
}