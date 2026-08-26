import ApiResponse from "../../core/ApiResponse.js";
import ApiError from "../../core/ApiError.js";
import asyncHandler from "../../core/asyncHandler.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../utils/cookies.js";
import { HTTP_STATUS } from "../../constants/http.constants.js";
import { AUTH_MESSAGES } from "./auth.constants.js";

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(
      req.validatedData
    );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        null,
        result.message
      )
    );
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN
      );
    }

    const result =
      await this.authService.verifyEmail(token);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        result.message
      )
    );
  });

  resendVerificationEmail = asyncHandler(
    async (req, res) => {
      const result =
        await this.authService.resendVerificationEmail(
          req.validatedData.email
        );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          result.message
        )
      );
    }
  );

  login = asyncHandler(async (req, res) => {
    const authResponse =
      await this.authService.login(
        req.validatedData,
        {
          userAgent: req.get("user-agent"),
          ipAddress: req.ip,
        }
      );

    setRefreshTokenCookie(
      res,
      authResponse.refreshToken
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        {
          user: authResponse.user,
          accessToken: authResponse.accessToken,
        },
        AUTH_MESSAGES.LOGIN_SUCCESS
      )
    );
  });

  refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const authResponse =
      await this.authService.refresh(refreshToken);

    setRefreshTokenCookie(
      res,
      authResponse.refreshToken
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        {
          user: authResponse.user,
          accessToken: authResponse.accessToken,
        },
        AUTH_MESSAGES.REFRESH_SUCCESS
      )
    );
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result =
      await this.authService.forgotPassword(
        req.validatedData.email
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        result.message
      )
    );
  });

  resetPassword = asyncHandler(async (req, res) => {
    const result =
      await this.authService.resetPassword(
        req.validatedData
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        result.message
      )
    );
  });

  me = asyncHandler(async (req, res) => {
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        req.user,
        AUTH_MESSAGES.USER_FETCHED_SUCCESS
      )
    );
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        AUTH_MESSAGES.LOGOUT_SUCCESS
      )
    );
  });

  logoutAll = asyncHandler(async (req, res) => {
    await this.authService.logoutAll(
      req.user.id
    );

    clearRefreshTokenCookie(res);

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        AUTH_MESSAGES.LOGOUT_ALL_SUCCESS
      )
    );
  });
}

export default AuthController;