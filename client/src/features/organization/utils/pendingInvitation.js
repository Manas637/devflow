const PENDING_INVITATION_KEY = "pendingInvitation";

export const savePendingInvitation = (token) => {
  if (!token) return;

  localStorage.setItem(
    PENDING_INVITATION_KEY,
    JSON.stringify({
      token,
      createdAt: Date.now(),
    })
  );
};

export const getPendingInvitation = () => {
  try {
    const value = localStorage.getItem(
      PENDING_INVITATION_KEY
    );

    if (!value) return null;

    const parsed = JSON.parse(value);

    // Optional safety: expire local state after 30 minutes
    const THIRTY_MINUTES = 30 * 60 * 1000;

    if (
      !parsed.createdAt ||
      Date.now() - parsed.createdAt > THIRTY_MINUTES
    ) {
      localStorage.removeItem(PENDING_INVITATION_KEY);
      return null;
    }

    return parsed.token;
  } catch {
    localStorage.removeItem(PENDING_INVITATION_KEY);
    return null;
  }
};

export const clearPendingInvitation = () => {
  localStorage.removeItem(PENDING_INVITATION_KEY);
};