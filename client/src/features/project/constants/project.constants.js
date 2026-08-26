export const PROJECT_QUERY_KEYS = {
  all: ["projects"],

  list: (organizationId) => [
    ...PROJECT_QUERY_KEYS.all,
    "list",
    organizationId,
  ],

  detail: (projectId) => [
    ...PROJECT_QUERY_KEYS.all,
    "detail",
    projectId,
  ],

  members: (projectId) => [
    ...PROJECT_QUERY_KEYS.all,
    "members",
    projectId,
  ],

  membership: (projectId) => [
    ...PROJECT_QUERY_KEYS.all,
    "membership",
    projectId,
  ],
};