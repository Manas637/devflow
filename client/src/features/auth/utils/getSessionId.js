import { jwtDecode } from "jwt-decode";

export default function getSessionId(accessToken) {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwtDecode(accessToken);

    return payload.sessionId ?? null;
  } catch {
    return null;
  }
}