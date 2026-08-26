import ApiError from "../core/ApiError.js";

import { HTTP_STATUS } from "../constants/http.constants.js";
import { AUTH_MESSAGES } from "../modules/auth/auth.constants.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          AUTH_MESSAGES.UNAUTHORIZED
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          AUTH_MESSAGES.FORBIDDEN
        )
      );
    }

    next();
  };
};

export default authorize;