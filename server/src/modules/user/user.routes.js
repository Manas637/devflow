import { Router } from "express";

import { userController } from "../../container/user.container.js";
import { authMiddleware } from "../../container/auth.container.js";

import validate from "../../middleware/validate.middleware.js";

import { updateProfileSchema, changePasswordSchema } from "./user.validation.js";

const router = Router();

router.patch(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateProfile
);

router.patch(
  "/me/password",
  authMiddleware,
  validate(changePasswordSchema),
  userController.changePassword
);

router.get(
  "/me/sessions",
  authMiddleware,
  userController.getSessions
);

router.delete(
  "/me/sessions/others",
  authMiddleware,
  userController.revokeOtherSessions
);

router.delete(
  "/me/sessions/:sessionId",
  authMiddleware,
  userController.revokeSession
);

router.get(
  "/:id",
  authMiddleware,
  userController.getPublicProfile
);

export default router;