import ApiError from "../core/ApiError.js";

import { HTTP_STATUS } from "../constants/http.constants.js";
import { AUTH_MESSAGES } from "../modules/auth/auth.constants.js";

const authenticate = ({
  authRepository,
  jwtService,
}) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.UNAUTHORIZED
        );
      }

      const accessToken = authHeader.split(" ")[1];

      const payload =
        jwtService.verifyAccessToken(accessToken);

      if (!payload) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.INVALID_ACCESS_TOKEN
        );
      }

      const session =
        await authRepository.findSessionById(
          payload.sessionId
        );

      if (!session) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.SESSION_NOT_FOUND
        );
      }

      if (session.userId !== payload.userId) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.UNAUTHORIZED
        );
      }

      if (session.expiresAt <= new Date()) {
        await authRepository.deleteSession(
          session.id
        );

        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.SESSION_EXPIRED
        );
      }

      const user =
        await authRepository.findUserById(
          payload.userId
        );

      if (!user) {
        await authRepository.deleteSession(
          session.id
        );

        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.UNAUTHORIZED
        );
      }

      req.auth = payload;
      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
};


/*
|--------------------------------------------------------------------------
| Optional Authentication
|--------------------------------------------------------------------------
|
| Used for public endpoints that can provide better UX when the
| user is authenticated.
|
| Example:
| GET /organizations/invitations/:token
|
| The endpoint remains public.
|
*/

const optionalAuthenticate = ({
  authRepository,
  jwtService,
}) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      /*
       * No access token.
       *
       * That's completely valid for an optional-auth endpoint.
       */
      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {
        req.auth = null;
        req.user = null;

        return next();
      }

      const accessToken = authHeader.split(" ")[1];

      const payload =
        jwtService.verifyAccessToken(accessToken);

      /*
       * Invalid token.
       *
       * Treat the request as unauthenticated instead of
       * returning 401 because the endpoint is public.
       */
      if (!payload) {
        req.auth = null;
        req.user = null;

        return next();
      }

      const session =
        await authRepository.findSessionById(
          payload.sessionId
        );

      if (!session) {
        req.auth = null;
        req.user = null;

        return next();
      }

      if (session.userId !== payload.userId) {
        req.auth = null;
        req.user = null;

        return next();
      }

      if (session.expiresAt <= new Date()) {
        await authRepository.deleteSession(
          session.id
        );

        req.auth = null;
        req.user = null;

        return next();
      }

      const user =
        await authRepository.findUserById(
          payload.userId
        );

      if (!user) {
        await authRepository.deleteSession(
          session.id
        );

        req.auth = null;
        req.user = null;

        return next();
      }

      /*
       * Authentication succeeded.
       */
      req.auth = payload;
      req.user = user;

      next();
    } catch (error) {
      /*
       * Optional authentication must never make the
       * public invitation endpoint fail because of auth.
       */
      req.auth = null;
      req.user = null;

      next();
    }
  };
};

export {
  authenticate,
  optionalAuthenticate,
};

export default authenticate;