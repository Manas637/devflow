export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
};

export const userWithPasswordSelect = {
  ...userSelect,

  password: true,
};

export const sessionSelect = {
  id: true,
  userId: true,
  refreshTokenHash: true,
  userAgent: true,
  ipAddress: true,
  expiresAt: true,
  lastUsedAt: true,
  createdAt: true,
};

export const userSessionSelect = {
  id: true,
  userAgent: true,
  ipAddress: true,
  createdAt: true,
  lastUsedAt: true,
  expiresAt: true,
};

export const publicUserSelect = {
  id: true,
  name: true,
  avatar: true,
};

export const organizationSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
};

export const membershipSelect = {
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  organizationId: true,
};

export const organizationWithMembershipSelect = {
  ...organizationSelect,

  memberships: {
    select: {
      id: true,
      role: true,
      userId: true,
      createdAt: true,
    },
  },
};

export const membershipWithUserSelect = {
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  organizationId: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
};

/*
|--------------------------------------------------------------------------
| Project
|--------------------------------------------------------------------------
*/

export const projectSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  status: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
};

export const projectMembershipSelect = {
  id: true,
  userId: true,
  projectId: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const projectMembershipWithUserSelect = {
  id: true,
  userId: true,
  projectId: true,
  role: true,
  createdAt: true,
  updatedAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
};

export const projectWithMembershipSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  status: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,

  memberships: {
    select: {
      id: true,
      userId: true,
      projectId: true,
      role: true,
    },

    where: {
      // This will be handled differently below
    },
  },
};