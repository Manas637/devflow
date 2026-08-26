import api from "@/api/axios";

export const updateProfile = (data) =>
  api.patch("/users/me", data);

export const changePassword = (data) =>
  api.patch("/users/me/password", data);

export const getSessions = () => {
  return api.get("/users/me/sessions");
};

export const revokeSession = (sessionId) => {
  return api.delete(`/users/me/sessions/${sessionId}`);
};

export const revokeOtherSessions = () => {
  return api.delete("/users/me/sessions/others");
};