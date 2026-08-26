import { z } from "zod";

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

export const createOrganizationSchema = z
    .object({
        name: organizationNameSchema
    })
    .strict();