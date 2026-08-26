export const toUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const toTokenPayload = (user, sessionId) => ({
  userId: user.id,
  role: user.role,
  sessionId,
});

export const toAuthResponse = (
  user,
  accessToken,
  refreshToken
) => ({
  user: toUserResponse(user),
  accessToken,
  refreshToken,
});