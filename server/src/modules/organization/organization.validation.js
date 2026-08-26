import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Common Schemas
|--------------------------------------------------------------------------
*/

const organizationNameSchema = z
  .string()
  .trim()
  .min(
    2,
    "Organization name must be at least 2 characters."
  )
  .max(
    100,
    "Organization name must not exceed 100 characters."
  );

const organizationIdSchema = z
  .string()
  .min(1, "Organization ID is required.");

const memberIdSchema = z
  .string()
  .min(1, "Member ID is required.");

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .max(254, "Email address is too long.")
  .transform((email) => email.toLowerCase());

/*
|--------------------------------------------------------------------------
| Organization
|--------------------------------------------------------------------------
*/

export const createOrganizationSchema = z
  .object({
    name: organizationNameSchema,
  })
  .strict();

export const updateOrganizationSchema = z
  .object({
    name: organizationNameSchema,
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Organization Params
|--------------------------------------------------------------------------
*/

export const organizationIdParamSchema = z
  .object({
    organizationId: organizationIdSchema,
  })
  .strict();

export const membershipIdParamSchema = z
  .object({
    organizationId: organizationIdSchema,

    memberId: memberIdSchema,
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Membership
|--------------------------------------------------------------------------
*/

export const updateMemberRoleSchema = z
  .object({
    role: z.enum(
      ["ADMIN", "MEMBER", "OWNER"],
      {
        message: "Invalid organization role.",
      }
    ),
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Invitations
|--------------------------------------------------------------------------
*/

/**
 * POST /organizations/:organizationId/invitations
 */
export const createInvitationSchema = z
  .object({
    email: emailSchema,

    role: z
      .enum(
        ["ADMIN", "MEMBER"],
        {
          message: "Invalid invitation role.",
        }
      )
      .default("MEMBER"),
  })
  .strict();

export const getInvitationParamSchema = z
  .object({
    token: z
      .string()
      .min(1, "Invitation token is required."),
  })
  .strict();

/**
 * Invitation ID
 *
 * Used for:
 * DELETE /organizations/:organizationId/invitations/:invitationId
 */
export const invitationIdParamSchema = z
  .object({
    organizationId: organizationIdSchema,

    invitationId: z
      .string()
      .min(1, "Invitation ID is required."),
  })
  .strict();

/**
 * Accept/reject invitation token
 *
 * Used by public invitation endpoints.
 */
export const invitationTokenSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, "Invitation token is required."),
  })
  .strict();

export const searchOrganizationMembersSchema =
  z.object({
    search: z
      .string()
      .trim()
      .min(
        1,
        "Search query is required."
      )
      .max(
        100,
        "Search query is too long."
      ),
  });