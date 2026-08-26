import ApiResponse from "../../core/ApiResponse.js";
import asyncHandler from "../../core/asyncHandler.js";

import { HTTP_STATUS } from "../../constants/http.constants.js";

import { USER_MESSAGES } from "./user.constants.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  updateProfile = asyncHandler(async (req, res) => {
    const user = await this.userService.updateProfile(
      req.user.id,
      req.validatedData
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        user,
        USER_MESSAGES.PROFILE_UPDATED_SUCCESS
      )
    );
  });

  getPublicProfile = asyncHandler(async (req, res) => {
    const user = await this.userService.getPublicProfile(
      req.params.id
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        user,
        USER_MESSAGES.PROFILE_FETCHED_SUCCESS
      )
    );
  });

  changePassword = asyncHandler(async (req, res) => {
    await this.userService.changePassword(
      req.user.id,
      req.auth.sessionId,
      req.validatedData
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        USER_MESSAGES.PASSWORD_CHANGED_SUCCESS
      )
    );
  });

  
  getSessions = asyncHandler(async (req, res) => {
    const sessions =
      await this.userService.getSessions(
        req.user.id,
        req.auth.sessionId
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        sessions,
        USER_MESSAGES.SESSIONS_FETCHED_SUCCESS
      )
    );
  });

  revokeSession = asyncHandler(async (req, res) => {
    await this.userService.revokeSession(
      req.user.id,
      req.auth.sessionId,
      req.params.sessionId
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        USER_MESSAGES.SESSION_REVOKED_SUCCESS
      )
    );
  });

  revokeOtherSessions = asyncHandler(async (req, res) => {
    await this.userService.revokeOtherSessions(
      req.user.id,
      req.auth.sessionId
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        USER_MESSAGES.OTHER_SESSIONS_REVOKED_SUCCESS
      )
    );
  });
}

export default UserController;