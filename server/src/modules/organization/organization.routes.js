import { Router } from "express";

import {
  organizationController,
} from "../../container/organization.container.js";

import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../../container/auth.container.js";

import validate from "../../middleware/validate.middleware.js";

import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationIdParamSchema,
  membershipIdParamSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
  invitationIdParamSchema,
  invitationTokenSchema,
  getInvitationParamSchema,
  searchOrganizationMembersSchema,
} from "./organization.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Organizations
|--------------------------------------------------------------------------
*/

/**
 * Create organization
 *
 * POST /organizations
 */
router.post(
  "/",
  authMiddleware,
  validate(createOrganizationSchema),
  organizationController.createOrganization
);

/**
 * Get user's organizations
 *
 * GET /organizations
 */
router.get(
  "/",
  authMiddleware,
  organizationController.getOrganizations
);

/*
|--------------------------------------------------------------------------
| Public Invitation Routes
|--------------------------------------------------------------------------
|
| These do NOT require authentication.
|
*/

/**
 * Get invitation details
 *
 * GET /organizations/invitations/:token
 */
router.get(
  "/invitations/:token",
  optionalAuthMiddleware,
  validate(
    getInvitationParamSchema,
    "params"
  ),
  organizationController.getInvitationByToken
);

/**
 * Accept invitation
 *
 * POST /organizations/invitations/:token/accept
 */
router.post(
  "/invitations/:token/accept",
  authMiddleware,
  validate(
    invitationTokenSchema,
    "params"
  ),
  organizationController.acceptInvitation
);

/**
 * Reject invitation
 *
 * POST /organizations/invitations/:token/reject
 */
router.post(
  "/invitations/:token/reject",
  authMiddleware,
  validate(
    invitationTokenSchema,
    "params"
  ),
  organizationController.rejectInvitation
);

/**
 * Get organization
 *
 * GET /organizations/:organizationId
 */
router.get(
  "/:organizationId",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  organizationController.getOrganization
);

/**
 * Update organization
 *
 * PATCH /organizations/:organizationId
 */
router.patch(
  "/:organizationId",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  validate(
    updateOrganizationSchema
  ),
  organizationController.updateOrganization
);

/**
 * Delete organization
 *
 * DELETE /organizations/:organizationId
 */
router.delete(
  "/:organizationId",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  organizationController.deleteOrganization
);

router.delete(
  "/:organizationId/leave",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  organizationController.leaveOrganization
);

/*
|--------------------------------------------------------------------------
| Members
|--------------------------------------------------------------------------
*/

/**
 * Get organization members
 *
 * GET /organizations/:organizationId/members
 */
router.get(
  "/:organizationId/members",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  organizationController.getMembers
);

/**
 * Update member role
 *
 * PATCH /organizations/:organizationId/members/:memberId
 */
router.patch(
  "/:organizationId/members/:memberId",
  authMiddleware,
  validate(
    membershipIdParamSchema,
    "params"
  ),
  validate(
    updateMemberRoleSchema
  ),
  organizationController.updateMemberRole
);

/**
 * Remove member
 *
 * DELETE /organizations/:organizationId/members/:memberId
 */
router.delete(
  "/:organizationId/members/:memberId",
  authMiddleware,
  validate(
    membershipIdParamSchema,
    "params"
  ),
  organizationController.removeMember
);

/*
|--------------------------------------------------------------------------
| Invitations
|--------------------------------------------------------------------------
*/

/**
 * Send invitation
 *
 * POST /organizations/:organizationId/invitations
 */
router.post(
  "/:organizationId/invitations",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  validate(
    createInvitationSchema
  ),
  organizationController.createInvitation
);

/**
 * Get organization invitations
 *
 * GET /organizations/:organizationId/invitations
 */
router.get(
  "/:organizationId/invitations",
  authMiddleware,
  validate(
    organizationIdParamSchema,
    "params"
  ),
  organizationController.getInvitations
);

/**
 * Cancel invitation
 *
 * DELETE /organizations/:organizationId/invitations/:invitationId
 */
router.delete(
  "/:organizationId/invitations/:invitationId",
  authMiddleware,
  validate(
    invitationIdParamSchema,
    "params"
  ),
  organizationController.cancelInvitation
);

router.get(
  "/:organizationId/members/search",
  authMiddleware,

  validate(
    organizationIdParamSchema,
    "params"
  ),

  validate(
    searchOrganizationMembersSchema,
    "query"
  ),

  organizationController.searchMembers
);

export default router;