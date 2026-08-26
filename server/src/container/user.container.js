import logger from "../config/logger.js";

import userRepository from "../modules/user/user.repository.js";
import authRepository from "../modules/auth/auth.repository.js";

import UserController from "../modules/user/user.controller.js";
import UserService from "../modules/user/user.service.js";
import JwtService from "../services/JwtService.js";
import PasswordService from "../services/PasswordService.js";
import SessionService from "../modules/auth/session.service.js";
import DatabaseService from "../services/DatabaseService.js";

const passwordService = new PasswordService()
const jwtService = new JwtService();
const sessionService = new SessionService({
  authRepository,
  jwtService,
});
const databaseService = new DatabaseService();

const userService = new UserService({
  userRepository,
  logger,
  passwordService,
  sessionService,
  databaseService
});

const userController = new UserController(userService);

export { userController };