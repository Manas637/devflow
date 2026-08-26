import prisma from "../../lib/prisma.js";

import {
  organizationSelect,
  organizationWithMembershipSelect,
  membershipSelect,
  membershipWithUserSelect,
} from "../../lib/prisma/selects.js";

/*
|--------------------------------------------------------------------------
| Organization
|--------------------------------------------------------------------------
*/

export const createOrganization = async (
  organizationData,
  db = prisma
) => {
  return db.organization.create({
    data: organizationData,
    select: organizationSelect,
  });
};

export const findOrganizationById = async (
  organizationId,
  db = prisma
) => {
  return db.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: organizationSelect,
  });
};

export const findOrganizationBySlug = async (
  slug,
  db = prisma
) => {
  return db.organization.findUnique({
    where: {
      slug,
    },
    select: organizationSelect,
  });
};

export const getOrganizationsByUserId = async (
  userId,
  db = prisma
) => {
  return db.organization.findMany({
    where: {
      memberships: {
        some: {
          userId,
        },
      },
    },
    select: organizationWithMembershipSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateOrganization = async (
  organizationId,
  organizationData,
  db = prisma
) => {
  return db.organization.update({
    where: {
      id: organizationId,
    },
    data: organizationData,
    select: organizationSelect,
  });
};

export const deleteOrganization = async (
  organizationId,
  db = prisma
) => {
  return db.organization.delete({
    where: {
      id: organizationId,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Membership
|--------------------------------------------------------------------------
*/

export const createMembership = async (
  membershipData,
  db = prisma
) => {
  return db.membership.create({
    data: membershipData,
    select: membershipSelect,
  });
};

export const findMembership = async (
  userId,
  organizationId,
  db = prisma
) => {
  return db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    select: membershipSelect,
  });
};

export const findMembershipById = async (
  membershipId,
  db = prisma
) => {
  return db.membership.findUnique({
    where: {
      id: membershipId,
    },
    select: membershipSelect,
  });
};

export const findMembershipByUserEmail = async (
  email,
  organizationId,
  db = prisma
) => {
  return db.membership.findFirst({
    where: {
      organizationId,
      user: {
        email,
      },
    },
    select: {
      id: true,
      userId: true,
      organizationId: true,
      role: true,
    },
  });
};

export const getOrganizationMembers = async (
  organizationId,
  db = prisma
) => {
  return db.membership.findMany({
    where: {
      organizationId,
    },
    select: membershipWithUserSelect,
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const findMembershipWithUser = async (
  membershipId,
  db = prisma
) => {
  return db.membership.findUnique({
    where: {
      id: membershipId,
    },
    select: membershipWithUserSelect,
  });
};

export const updateMembershipRole = async (
  membershipId,
  role,
  db = prisma
) => {
  return db.membership.update({
    where: {
      id: membershipId,
    },
    data: {
      role,
    },
    select: membershipSelect,
  });
};

export const deleteMembership = async (
  membershipId,
  db = prisma
) => {
  return db.membership.delete({
    where: {
      id: membershipId,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Organization Invitations
|--------------------------------------------------------------------------
*/

export const createInvitation = async (
  invitationData,
  db = prisma
) => {
  return db.organizationInvitation.create({
    data: invitationData,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      organizationId: true,
      invitedById: true,
    },
  });
};

export const findInvitationById = async (
  invitationId,
  db = prisma
) => {
  return db.organizationInvitation.findUnique({
    where: {
      id: invitationId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      organizationId: true,
      invitedById: true,
    }
  });
};

export const findInvitationByTokenHash = async (
  tokenHash,
  db = prisma
) => {
  return db.organizationInvitation.findUnique({
    where: {
      tokenHash,
    },

    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};

export const findPendingInvitation = async (
  organizationId,
  email,
  db = prisma
) => {
  return db.organizationInvitation.findFirst({
    where: {
      organizationId,
      email,
      status: "PENDING",
      expiresAt: {
        gt: new Date(),
      },
    },
  });
};

export const getOrganizationInvitations = async (
  organizationId,
  db = prisma
) => {
  return db.organizationInvitation.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      invitedById: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateInvitationStatus = async (
  invitationId,
  status,
  db = prisma
) => {
  return db.organizationInvitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status,
    },
  });
};

export const deleteInvitation = async (
  invitationId,
  db = prisma
) => {
  return db.organizationInvitation.delete({
    where: {
      id: invitationId,
    },
  });
};

export const searchOrganizationMembers = async (
  organizationId,
  search,
  db = prisma
) => {
  return db.membership.findMany({
    where: {
      organizationId,

      user: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    },

    select: membershipWithUserSelect,

    orderBy: {
      createdAt: "asc",
    },

    take: 10,
  });
};

const organizationRepository = {
  createOrganization,
  findOrganizationById,
  findOrganizationBySlug,
  getOrganizationsByUserId,
  updateOrganization,
  deleteOrganization,

  createMembership,
  findMembership,
  findMembershipById,
  findMembershipByUserEmail,
  getOrganizationMembers,
  findMembershipWithUser,
  updateMembershipRole,
  deleteMembership,

  createInvitation,
  findInvitationById,
  findInvitationByTokenHash,
  findPendingInvitation,
  getOrganizationInvitations,
  updateInvitationStatus,
  deleteInvitation,

  searchOrganizationMembers
};

export default organizationRepository;