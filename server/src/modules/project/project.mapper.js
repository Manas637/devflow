/*
|--------------------------------------------------------------------------
| Project Mapper
|--------------------------------------------------------------------------
*/

export const toProjectResponse = (project) => {
  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    status: project.status,
    organizationId: project.organizationId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

/*
|--------------------------------------------------------------------------
| Project Membership
|--------------------------------------------------------------------------
*/

export const toProjectMembershipResponse = (
  membership
) => {
  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    userId: membership.userId,
    projectId: membership.projectId,
    role: membership.role,
    createdAt: membership.createdAt,
    updatedAt: membership.updatedAt,
  };
};

/*
|--------------------------------------------------------------------------
| Project Member
|--------------------------------------------------------------------------
*/

export const toProjectMemberResponse = (
  membership
) => {
  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    userId: membership.userId,
    projectId: membership.projectId,
    role: membership.role,

    user: membership.user
      ? {
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
          avatar: membership.user.avatar,
        }
      : null,

    createdAt: membership.createdAt,
    updatedAt: membership.updatedAt,
  };
};

/*
|--------------------------------------------------------------------------
| Project With Memberships
|--------------------------------------------------------------------------
*/

export const toProjectWithMembershipResponse = (
  project
) => {
  if (!project) {
    return null;
  }

  return {
    ...toProjectResponse(project),

    memberships:
      project.memberships?.map(
        toProjectMembershipResponse
      ) ?? [],
  };
};