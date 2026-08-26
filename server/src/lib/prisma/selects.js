export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
};

export const userWithPasswordSelect = {
  ...userSelect,

  password: true,
};

export const sessionSelect = {
  id: true,
  userId: true,
  refreshTokenHash: true,
  userAgent: true,
  ipAddress: true,
  expiresAt: true,
  lastUsedAt: true,
  createdAt: true,
};

export const userSessionSelect = {
  id: true,
  userAgent: true,
  ipAddress: true,
  createdAt: true,
  lastUsedAt: true,
  expiresAt: true,
};