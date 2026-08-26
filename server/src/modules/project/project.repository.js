import prisma from "../../lib/prisma.js";

import {
  projectSelect,
  projectMembershipSelect,
  projectMembershipWithUserSelect,
} from "../../lib/prisma/selects.js";

/*
|--------------------------------------------------------------------------
| Project
|--------------------------------------------------------------------------
*/

export const createProject = async (
  projectData,
  db = prisma
) => {
  return db.project.create({
    data: projectData,
    select: projectSelect,
  });
};

export const findProjectById = async (
  projectId,
  db = prisma
) => {
  return db.project.findUnique({
    where: {
      id: projectId,
    },
    select: projectSelect,
  });
};

export const findProjectBySlug = async (
  organizationId,
  slug,
  db = prisma
) => {
  return db.project.findUnique({
    where: {
      organizationId_slug: {
        organizationId,
        slug,
      },
    },
    select: projectSelect,
  });
};

export const getProjectsByOrganizationId = async (
  organizationId,
  db = prisma
) => {
  return db.project.findMany({
    where: {
      organizationId,
    },

    select: projectSelect,

    orderBy: {
      createdAt: "desc",
    },
  });
};

/*
|--------------------------------------------------------------------------
| Projects accessible by a user
|--------------------------------------------------------------------------
|
| Used for organization members who are not organization OWNER/ADMIN.
|
*/

export const getProjectsByUserId = async (
  organizationId,
  userId,
  db = prisma
) => {
  return db.project.findMany({
    where: {
      organizationId,

      memberships: {
        some: {
          userId,
        },
      },
    },

    select: projectSelect,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateProject = async (
  projectId,
  projectData,
  db = prisma
) => {
  return db.project.update({
    where: {
      id: projectId,
    },

    data: projectData,

    select: projectSelect,
  });
};

export const archiveProject = async (
  projectId,
  db = prisma
) => {
  return db.project.update({
    where: {
      id: projectId,
    },

    data: {
      status: "ARCHIVED",
    },

    select: projectSelect,
  });
};

export const activateProject = async (
  projectId,
  db = prisma
) => {
  return db.project.update({
    where: {
      id: projectId,
    },

    data: {
      status: "ACTIVE",
    },

    select: projectSelect,
  });
};

export const deleteProject = async (
  projectId,
  db = prisma
) => {
  return db.project.delete({
    where: {
      id: projectId,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Project Membership
|--------------------------------------------------------------------------
*/

export const createProjectMembership = async (
  membershipData,
  db = prisma
) => {
  return db.projectMembership.create({
    data: membershipData,

    select: projectMembershipSelect,
  });
};

export const findProjectMembership = async (
  userId,
  projectId,
  db = prisma
) => {
  return db.projectMembership.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },

    select: projectMembershipSelect,
  });
};

export const findProjectMembershipById = async (
  membershipId,
  db = prisma
) => {
  return db.projectMembership.findUnique({
    where: {
      id: membershipId,
    },

    select: projectMembershipSelect,
  });
};

export const getProjectMembers = async (
  projectId,
  db = prisma
) => {
  return db.projectMembership.findMany({
    where: {
      projectId,
    },

    select: projectMembershipWithUserSelect,

    orderBy: {
      createdAt: "asc",
    },
  });
};

export const updateProjectMembershipRole = async (
  membershipId,
  role,
  db = prisma
) => {
  return db.projectMembership.update({
    where: {
      id: membershipId,
    },

    data: {
      role,
    },

    select: projectMembershipSelect,
  });
};

export const deleteProjectMembership = async (
  membershipId,
  db = prisma
) => {
  return db.projectMembership.delete({
    where: {
      id: membershipId,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Project Creation Transaction
|--------------------------------------------------------------------------
|
| Creates:
|
|   1. Project
|   2. ProjectMembership for creator as OWNER
|
*/

export const createProjectWithOwner = async (
  projectData,
  membershipData,
  db
) => {
  const project = await createProject(
    projectData,
    db
  );

  const membership =
    await createProjectMembership(
      {
        ...membershipData,
        projectId: project.id,
      },
      db
    );

  return {
    project,
    membership,
  };
};

export const findProjectMembershipWithUser = async (
  userId,
  projectId,
  db = prisma
) => {
  return db.projectMembership.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },

    select: projectMembershipWithUserSelect,
  });
};

const projectRepository = {
  createProject,
  findProjectById,
  findProjectBySlug,
  getProjectsByOrganizationId,
  getProjectsByUserId,
  updateProject,
  archiveProject,
  activateProject,
  deleteProject,

  createProjectMembership,
  findProjectMembership,
  findProjectMembershipById,
  findProjectMembershipWithUser,
  getProjectMembers,
  updateProjectMembershipRole,
  deleteProjectMembership,

  createProjectWithOwner,
};

export default projectRepository;