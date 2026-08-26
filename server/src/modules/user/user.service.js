import ApiError from "../../core/ApiError.js";

import { HTTP_STATUS } from "../../constants/http.constants.js";

import { USER_MESSAGES } from "./user.constants.js";
import { toPublicUserResponse, toUserResponse } from "./user.mapper.js";
import { toSessionsResponse } from "./user.session.mapper.js";

class UserService {
  constructor({
    userRepository,
    logger,
    passwordService,
    sessionService,
    databaseService,
  }) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.passwordService = passwordService
    this.sessionService = sessionService
    this.databaseService = databaseService
  }

  async updateProfile(userId, profileData) {
    const existingUser =
      await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        USER_MESSAGES.USER_NOT_FOUND
      );
    }

    const name = profileData.name.trim();

    if (name === existingUser.name) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        USER_MESSAGES.NO_PROFILE_CHANGES
      );
    }

    const updatedUser =
      await this.userRepository.updateUser(
        userId,
        { name }
      );

    this.logger.info(
      { userId },
      USER_MESSAGES.PROFILE_UPDATED_SUCCESS
    );

    return toUserResponse(updatedUser);
  }

  async getPublicProfile(userId) {
    const user =
      await this.userRepository.findPublicUserById(
        userId
      );

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        USER_MESSAGES.USER_NOT_FOUND
      );
    }

    return toPublicUserResponse(user);
  }

  async changePassword(
    userId,
    sessionId,
    passwordData
  ) {
    const user =
      await this.userRepository.findUserForPasswordChange(
        userId
      );

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        USER_MESSAGES.USER_NOT_FOUND
      );
    }

    const isCurrentPasswordValid =
      await this.passwordService.compare(
        passwordData.currentPassword,
        user.password
      );

    if (!isCurrentPasswordValid) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        USER_MESSAGES.INVALID_CURRENT_PASSWORD
      );
    }

    const hashedPassword =
      await this.passwordService.hash(
        passwordData.newPassword
      );

    await this.databaseService.transaction(
      async (tx) => {
        // 1. Change password
        await this.userRepository.updatePassword(
          userId,
          hashedPassword,
          tx
        );

        // 2. Logout every other device/session
        await this.sessionService.deleteAllSessionsExcept(
          userId,
          sessionId,
          tx
        );
      }
    );

    this.logger.info(
      {
        userId,
        sessionId,
      },
      USER_MESSAGES.PASSWORD_CHANGED_SUCCESS
    );
  }

  async getSessions(userId, currentSessionId) {
    const sessions =
      await this.sessionService.getSessions(userId);

    return toSessionsResponse(
      sessions,
      currentSessionId
    )
  }

  async revokeSession(
    userId,
    currentSessionId,
    sessionId
  ) {
    if (sessionId === currentSessionId) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        USER_MESSAGES.CANNOT_REVOKE_CURRENT_SESSION
      );
    }

    const result =
      await this.sessionService.revokeSession(
        userId,
        sessionId
      );

    if (result.count === 0) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        USER_MESSAGES.SESSION_NOT_FOUND
      );
    }

    this.logger.info(
      {
        userId,
        sessionId,
      },
      USER_MESSAGES.SESSION_REVOKED_SUCCESS
    );
  }

  async revokeOtherSessions(
    userId,
    currentSessionId
  ) {
    await this.sessionService.revokeOtherSessions(
      userId,
      currentSessionId
    );

    this.logger.info(
      {
        userId,
        currentSessionId,
      },
      USER_MESSAGES.OTHER_SESSIONS_REVOKED_SUCCESS
    );
}
}

export default UserService;