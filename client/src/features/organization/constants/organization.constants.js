export const ORGANIZATION_QUERY_KEYS = {
  all: ["organizations"],

  list: () => [
    ...ORGANIZATION_QUERY_KEYS.all,
    "list",
  ],

  detail: (organizationId) => [
    ...ORGANIZATION_QUERY_KEYS.all,
    "detail",
    organizationId,
  ],

  members: (organizationId) => [
    ...ORGANIZATION_QUERY_KEYS.all,
    "members",
    organizationId,
  ],

  invitations: (organizationId) => [
    ...ORGANIZATION_QUERY_KEYS.all,
    "invitations",
    organizationId,
  ],

  invitation: (token,userId) => [
    ...ORGANIZATION_QUERY_KEYS.all,
    "invitation",
    token,
    userId
  ],
};