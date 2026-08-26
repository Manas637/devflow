export const toSessionResponse = (
  session,
  currentSessionId
) => ({
  id: session.id,
  userAgent: session.userAgent,
  ipAddress: session.ipAddress,
  createdAt: session.createdAt,
  lastUsedAt: session.lastUsedAt,
  expiresAt: session.expiresAt,
  isCurrent: session.id === currentSessionId,
});

export const toSessionsResponse = (
  sessions,
  currentSessionId
) =>
  sessions.map((session) =>
    toSessionResponse(session, currentSessionId)
  );