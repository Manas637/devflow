import logger from "../config/logger.js";

import projectRepository from "../modules/project/project.repository.js";
import organizationRepository from "../modules/organization/organization.repository.js";

import ProjectService from "../modules/project/project.service.js";
import ProjectController from "../modules/project/project.controller.js";

import DatabaseService from "../services/DatabaseService.js";

const databaseService =
  new DatabaseService();

const projectService =
  new ProjectService({
    projectRepository,
    organizationRepository,
    databaseService,
    logger,
  });

const projectController =
  new ProjectController(
    projectService
  );

export {
  projectController,
};