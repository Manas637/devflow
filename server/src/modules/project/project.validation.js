import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Common
|--------------------------------------------------------------------------
*/

export const projectIdSchema = z.object({
  projectId: z
    .string()
    .trim()
    .min(1, "Project ID is required."),
});

export const organizationIdSchema = z.object({
  organizationId: z
    .string()
    .trim()
    .min(1, "Organization ID is required."),
});

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
*/

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required.")
    .max(
      100,
      "Project name cannot exceed 100 characters."
    ),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Project description cannot exceed 1000 characters."
    )
    .nullable()
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Organization Projects
|--------------------------------------------------------------------------
*/

export const organizationProjectsParamSchema =
  organizationIdSchema;

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
*/

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required.")
      .max(
        100,
        "Project name cannot exceed 100 characters."
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(
        1000,
        "Project description cannot exceed 1000 characters."
      )
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined,
    {
      message:
        "At least one field must be provided.",
    }
  );

/*
|--------------------------------------------------------------------------
| Project Membership
|--------------------------------------------------------------------------
*/

export const projectMemberRoleSchema = z.enum(
  ["ADMIN", "MEMBER", "VIEWER"],
  {
    message: "Invalid project member role.",
  }
);

/*
|--------------------------------------------------------------------------
| Add Project Member
|--------------------------------------------------------------------------
*/

export const addProjectMemberSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "User ID is required."),

  role: projectMemberRoleSchema,
});

/*
|--------------------------------------------------------------------------
| Update Project Member Role
|--------------------------------------------------------------------------
*/

export const updateProjectMemberRoleSchema =
  z.object({
    role: projectMemberRoleSchema,
  });

/*
|--------------------------------------------------------------------------
| Project Membership Params
|--------------------------------------------------------------------------
*/

export const projectMembershipParamSchema =
  projectIdSchema.extend({
    membershipId: z
      .string()
      .trim()
      .min(1, "Membership ID is required."),
  });