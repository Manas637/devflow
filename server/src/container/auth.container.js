import logger from "../config/logger.js";

import authRepository from "../modules/auth/auth.repository.js";

import AuthController from "../modules/auth/auth.controller.js";
import AuthService from "../modules/auth/auth.service.js";
import SessionService from "../modules/auth/session.service.js";

import DatabaseService from "../services/DatabaseService.js";
import PasswordService from "../services/PasswordService.js";
import JwtService from "../services/JwtService.js";
import TokenService from "../modules/token/token.service.js";
import emailQueueService from "../services/emailQueue.service.js";

import authenticate, { optionalAuthenticate } from "../middleware/auth.middleware.js";

const databaseService = new DatabaseService();
const passwordService = new PasswordService();
const jwtService = new JwtService();
const tokenService = new TokenService();

const sessionService = new SessionService({
  authRepository,
  jwtService,
});

const authService = new AuthService({
  authRepository,
  databaseService,
  sessionService,
  passwordService,
  tokenService,
  emailQueueService,
  jwtService,
  logger,
});

const authController = new AuthController(
  authService
);

const authMiddleware = authenticate({
  authRepository,
  jwtService,
});

const optionalAuthMiddleware = optionalAuthenticate({
  authRepository,
  jwtService
})

export {
  authController,
  authMiddleware,
  optionalAuthMiddleware
};