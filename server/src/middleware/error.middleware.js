import { ZodError } from "zod";

import logger from "../config/logger.js";
import env from "../config/env.js";

import ApiError from "../core/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert unknown errors into ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message =
      error.message || "Internal Server Error";

    error = new ApiError(
      statusCode,
      message,
      error.errors || [],
      error.stack
    );
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    error = new ApiError(
      400,
      "Validation failed",
      err.issues
    );
  }

  // Log the error
  logger.error(
    {
      err: error,
      requestId: req.id,
    },
    error.message
  );

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
  };

  // Never expose stack traces in production
  if (env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;