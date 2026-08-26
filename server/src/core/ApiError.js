class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);

    if (stack) {
      this.stack = stack;
    }
  }
}

export default ApiError;