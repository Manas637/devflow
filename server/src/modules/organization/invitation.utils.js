import crypto from "crypto";

export const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashInvitationToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export const getInvitationExpiry = (days = 7) => {
  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + days
  );

  return expiresAt;
};