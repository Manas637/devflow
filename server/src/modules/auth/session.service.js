import { AUTH } from "../../constants/auth.constants.js";

import {
  toAuthResponse,
  toTokenPayload,
} from "./auth.mapper.js";

class SessionService {
  constructor({
    authRepository,
    jwtService,
  }) {
    this.authRepository = authRepository;
    this.jwtService = jwtService;
  }

  createSessionData(userId, { userAgent, ipAddress } = {}) {
    return {
      userId,
      refreshTokenHash: null,
      userAgent,
      ipAddress,
      expiresAt: new Date(
        Date.now() + AUTH.REFRESH_TOKEN_COOKIE_MAX_AGE
      ),
    };
  }

  async createSession(
    userId,
    { userAgent, ipAddress } = {},
    db
  ) {
    return this.authRepository.createSession(
      this.createSessionData(userId, {
        userAgent,
        ipAddress,
      }),
      db
    );
  }

  async issueTokens(user, session, db) {
    const tokenPayload = toTokenPayload(
      user,
      session.id
    );

    const accessToken =
      this.jwtService.generateAccessToken(
        tokenPayload
      );

    const refreshToken =
      this.jwtService.generateRefreshToken(
        tokenPayload
      );

    const refreshTokenHash =
      this.jwtService.hashRefreshToken(
        refreshToken
      );

    await this.authRepository.updateSession(
      session.id,
      {
        refreshTokenHash,
        expiresAt: new Date(
          Date.now() +
            AUTH.REFRESH_TOKEN_COOKIE_MAX_AGE
        ),
        lastUsedAt: new Date(),
      },
      db
    );

    return toAuthResponse(
      user,
      accessToken,
      refreshToken
    );
  }

  async deleteSession(sessionId, db) {
    return this.authRepository.deleteSession(
      sessionId,
      db
    );
  }

  async deleteAllSessions(userId, db) {
    return this.authRepository.deleteAllSessions(
      userId,
      db
    );
  }

  async deleteAllSessionsExcept(userId, sessionId, db) {
    return this.authRepository.deleteAllSessionsExcept(
      userId,
      sessionId,
      db
    );
  }

  async getSessions(userId,db) {
    return this.authRepository.findSessionsByUserId(
      userId,
      db
    );
  }

  async revokeSession(userId, sessionId,db) {
    return this.authRepository.deleteSessionById(
      userId,
      sessionId,
      db
    );
  }

  async revokeOtherSessions(userId, currentSessionId,db) {
    return this.authRepository.deleteAllSessionsExcept(
      userId,
      currentSessionId,
      db
    );
  }
}

export default SessionService;