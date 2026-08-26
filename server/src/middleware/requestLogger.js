import crypto from "node:crypto";

import pinoHttp from "pino-http";

import logger from "../config/logger.js";

const requestLogger = pinoHttp({
  logger,

  // Unique request id
  genReqId() {
    return crypto.randomUUID();
  },

  // Hide sensitive information
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.set-cookie",
      "res.headers.set-cookie",
    ],
    censor: "[REDACTED]",
  },

  // Decide log level
  customLogLevel(req, res, err) {
    if (err || res.statusCode >= 500) return "error";

    if (res.statusCode >= 400) return "warn";

    return "info";
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed`;
  },

  customErrorMessage(req, res, err) {
    if (err) {
      return `${req.method} ${req.url} failed`;
    }

    return `${req.method} ${req.url} returned ${res.statusCode}`;
  },

  customProps(req) {
    return {
      requestId: req.id,
    };
  },
});

export default requestLogger;