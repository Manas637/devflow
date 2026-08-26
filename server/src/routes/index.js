import { Router } from "express";

import healthRoutes from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js"
import userRoutes from "../modules/user/user.routes.js"
import organizationRoutes from "../modules/organization/organization.routes.js";
import projectRoutes from "../modules/project/project.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organizations", organizationRoutes);
router.use("/", projectRoutes);

export default router;