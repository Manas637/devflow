import ApiError from "../../core/ApiError.js";
import { HTTP_STATUS } from "../../constants/http.constants.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { TokenType } from "@prisma/client";

class AuthService {
  constructor({
    authRepository,
    sessionService,
    databaseService,
    tokenService,
    emailQueueService,
    jwtService,
    passwordService,
    logger,
  }) {
    this.authRepository = authRepository;
    this.sessionService = sessionService;
    this.databaseService = databaseService;
    this.tokenService = tokenService;
    this.emailQueueService = emailQueueService;
    this.jwtService = jwtService;
    this.passwordService = passwordService;
    this.logger = logger;
  }

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  async register(userData) {
    const existingUser =
      await this.authRepository.findUserByEmail(
        userData.email
      );

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    const hashedPassword =
      await this.passwordService.hash(
        userData.password
      );

    const user =
      await this.databaseService.transaction(
        async (tx) => {
          return this.authRepository.createUser(
            {
              ...userData,
              password: hashedPassword,
            },
            tx
          );
        }
      );

    const verificationToken =
      await this.tokenService.create({
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
      });

    await this.emailQueueService.addVerificationEmailJob({
      user,
      token: verificationToken,
    });

    this.logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      AUTH_MESSAGES.REGISTER_SUCCESS
    );

    return {
      message:
        AUTH_MESSAGES.VERIFICATION_EMAIL_SENT,
    };
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  async login(loginData, requestMeta = {}) {
    const user =
      await this.authRepository.findUserByEmail(
        loginData.email
      );

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const isPasswordValid =
      await this.passwordService.compare(
        loginData.password,
        user.password
      );

    if (!isPasswordValid) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (!user.isEmailVerified) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED
      );
    }

    const { session } =
      await this.databaseService.transaction(
        async (tx) => {
          const session =
            await this.sessionService.createSession(
              user.id,
              requestMeta,
              tx
            );

          return { session };
        }
      );
    const authResponse =
      await this.sessionService.issueTokens(
        user,
        session
      );
    

    this.logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      AUTH_MESSAGES.LOGIN_SUCCESS
    );

    return authResponse;
  }

  // --------------------------------------------------
  // VERIFY EMAIL
  // --------------------------------------------------

  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN
      );
    }

    const tokenRecord =
      await this.tokenService.consume({
        token,
        type: TokenType.EMAIL_VERIFICATION,
      });

    if (!tokenRecord) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN
      );
    }

    const user = tokenRecord.user;

    // This should normally be impossible if the token
    // is deleted after successful verification, but it
    // protects against inconsistent states.
    if (user.isEmailVerified) {
      return {
        message:
          AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED,
      };
    }

    await this.authRepository.updateUserById(
      user.id,
      {
        isEmailVerified: true,
      }
    );

    this.logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      AUTH_MESSAGES.EMAIL_VERIFIED
    );

    return {
      message:
        AUTH_MESSAGES.EMAIL_VERIFIED_SUCCESS,
    };
  }

  // --------------------------------------------------
  // RESEND VERIFICATION EMAIL
  // --------------------------------------------------

  async resendVerificationEmail(email) {
    const user =
      await this.authRepository
        .findUserByEmailWithoutPassword(email);

    /*
     * Do not reveal whether an account exists.
     */
    if (!user) {
      return {
        message:
          AUTH_MESSAGES.VERIFICATION_EMAIL_SENT_AGAIN,
      };
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED
      );
    }

    const verificationToken =
      await this.tokenService.create({
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
      });

    await this.emailQueueService.addVerificationEmailJob({
      user,
      token: verificationToken,
    });

    this.logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      "Verification email resent successfully."
    );

    return {
      message:
        AUTH_MESSAGES.VERIFICATION_EMAIL_SENT_AGAIN,
    };
  }

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  async refresh(refreshToken) {
    const payload =
      this.jwtService.verifyRefreshToken(
        refreshToken
      );

    if (!payload) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const session =
      await this.authRepository.findSessionById(
        payload.sessionId
      );

    if (!session) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    if (session.expiresAt <= new Date()) {
      await this.authRepository.deleteSession(
        session.id
      );

      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.SESSION_EXPIRED
      );
    }

    const user =
      await this.authRepository.findUserById(
        payload.userId
      );

    if (!user) {
      await this.authRepository.deleteSession(
        session.id
      );

      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const isValid =
      this.jwtService.compareRefreshToken(
        refreshToken,
        session.refreshTokenHash
      );

    if (!isValid) {
      await this.authRepository.deleteSession(
        session.id
      );

      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const authResponse =
      await this.sessionService.issueTokens(
        user,
        session
      );

    this.logger.info(
      {
        userId: user.id,
        sessionId: session.id,
        email: user.email,
      },
      AUTH_MESSAGES.REFRESH_SUCCESS
    );

    return authResponse;
  }

  // --------------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------------

  async forgotPassword(email) {
    const user =
      await this.authRepository
        .findUserByEmailWithoutPassword(email);

    /*
     * Do not reveal whether an account exists.
     */
    if (!user) {
      return {
        message:
          AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      };
    }

    const resetToken =
      await this.tokenService.create({
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
      });

    await this.emailQueueService.addPasswordResetEmailJob({
      user,
      token: resetToken,
    });

    this.logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      "Password reset email sent successfully."
    );

    return {
      message:
        AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS,
    };
  }

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  async resetPassword({ token, password }) {
    const tokenRecord =
      await this.tokenService.consume({
        token,
        type: TokenType.PASSWORD_RESET,
      });

    if (!tokenRecord) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        AUTH_MESSAGES.INVALID_PASSWORD_RESET_TOKEN
      );
    }

    const hashedPassword =
      await this.passwordService.hash(password);

    await this.authRepository.updateUserById(
      tokenRecord.user.id,
      {
        password: hashedPassword,
      }
    );

    /*
     * Password change invalidates every existing session.
     */
    await this.sessionService.deleteAllSessions(
      tokenRecord.user.id
    );

    this.logger.info(
      {
        userId: tokenRecord.user.id,
        email: tokenRecord.user.email,
      },
      "Password reset successfully."
    );

    return {
      message:
        AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  async logout(refreshToken) {
    const payload =
      this.jwtService.verifyRefreshToken(
        refreshToken
      );

    if (!payload) {
      return;
    }

    const session =
      await this.authRepository.findSessionById(
        payload.sessionId
      );

    if (!session) {
      return;
    }

    await this.sessionService.deleteSession(
      session.id
    );

    this.logger.info(
      {
        userId: payload.userId,
        sessionId: session.id,
      },
      AUTH_MESSAGES.LOGOUT_SUCCESS
    );
  }

  // --------------------------------------------------
  // LOGOUT ALL
  // --------------------------------------------------

  async logoutAll(userId) {
    const result =
      await this.sessionService.deleteAllSessions(
        userId
      );

    this.logger.info(
      {
        userId,
        sessionsDeleted: result.count,
      },
      AUTH_MESSAGES.LOGOUT_ALL_SUCCESS
    );

    return result.count;
  }
}

export default AuthService;