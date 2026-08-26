import { Router } from "express";

import validate from "../../middleware/validate.middleware.js";

import {
  addProjectMemberSchema,
  createProjectSchema,
  organizationProjectsParamSchema,
  projectIdSchema,
  projectMembershipParamSchema,
  updateProjectMemberRoleSchema,
  updateProjectSchema,
} from "./project.validation.js";

import {
  projectController,
} from "../../container/project.container.js";

import {
  authMiddleware,
} from "../../container/auth.container.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Organization Projects
|--------------------------------------------------------------------------
*/

/*
 * Create Project
 *
 * POST /organizations/:organizationId/projects
 */

router.post(
  "/organizations/:organizationId/projects",

  authMiddleware,

  validate(
    organizationProjectsParamSchema,
    "params"
  ),

  validate(
    createProjectSchema,
    "body"
  ),

  projectController.createProject
);

/*
 * Get Organization Projects
 *
 * GET /organizations/:organizationId/projects
 */

router.get(
  "/organizations/:organizationId/projects",

  authMiddleware,

  validate(
    organizationProjectsParamSchema,
    "params"
  ),

  projectController.getProjectsByOrganization
);

/*
|--------------------------------------------------------------------------
| Individual Project
|--------------------------------------------------------------------------
*/

/*
 * Get Project
 *
 * GET /projects/:projectId
 */

router.get(
  "/projects/:projectId",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.getProject
);

/*
 * Update Project
 *
 * PATCH /projects/:projectId
 */

router.patch(
  "/projects/:projectId",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  validate(
    updateProjectSchema,
    "body"
  ),

  projectController.updateProject
);

/*
 * Archive Project
 *
 * PATCH /projects/:projectId/archive
 */

router.patch(
  "/projects/:projectId/archive",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.archiveProject
);

/*
 * Activate Project
 *
 * PATCH /projects/:projectId/activate
 */

router.patch(
  "/projects/:projectId/activate",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.activateProject
);

/*
 * Delete Project
 *
 * DELETE /projects/:projectId
 */

router.delete(
  "/projects/:projectId",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.deleteProject
);

/*
|--------------------------------------------------------------------------
| Project Membership
|--------------------------------------------------------------------------
*/

/*
 * Get Project Members
 *
 * GET /projects/:projectId/members
 */

router.get(
  "/projects/:projectId/members",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.getProjectMembers
);

/*
 * Add Project Member
 *
 * POST /projects/:projectId/members
 */

router.post(
  "/projects/:projectId/members",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  validate(
    addProjectMemberSchema,
    "body"
  ),

  projectController.addProjectMember
);

router.delete(
  "/projects/:projectId/members/me",
  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.leaveProject
);

/*
 * Get Current User's Membership
 *
 * GET /projects/:projectId/membership
 */

router.get(
  "/projects/:projectId/membership",

  authMiddleware,

  validate(
    projectIdSchema,
    "params"
  ),

  projectController.getMyProjectMembership
);

/*
 * Update Project Member Role
 *
 * PATCH /projects/:projectId/members/:membershipId
 */

router.patch(
  "/projects/:projectId/members/:membershipId",

  authMiddleware,

  validate(
    projectMembershipParamSchema,
    "params"
  ),

  validate(
    updateProjectMemberRoleSchema,
    "body"
  ),

  projectController.updateProjectMemberRole
);

/*
 * Remove Project Member
 *
 * DELETE /projects/:projectId/members/:membershipId
 */

router.delete(
  "/projects/:projectId/members/:membershipId",

  authMiddleware,

  validate(
    projectMembershipParamSchema,
    "params"
  ),

  projectController.removeProjectMember
);

export default router;