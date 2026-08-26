import logger from "../config/logger.js";

import organizationRepository from "../modules/organization/organization.repository.js";

import OrganizationController from "../modules/organization/organization.controller.js";

import OrganizationService from "../modules/organization/organization.service.js";

import DatabaseService from "../services/DatabaseService.js";

import userRepository from "../modules/user/user.repository.js";

import emailQueueService from "../services/emailQueue.service.js";

const databaseService =
  new DatabaseService();

const organizationService =
  new OrganizationService({
    organizationRepository,
    databaseService,
    logger,
    userRepository,
    emailQueueService,
  });

const organizationController =
  new OrganizationController(
    organizationService
  );

export {
  organizationController,
};