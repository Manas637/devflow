export const toOrganizationResponse = (
  organization
) => {
  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
};

export const toOrganizationListResponse = (
  organizations
) => {
  return organizations.map(
    toOrganizationResponse
  );
};

export const toMembershipResponse = (
  membership
) => {
  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    role: membership.role,
    userId: membership.userId,
    organizationId: membership.organizationId,
    createdAt: membership.createdAt,
    updatedAt: membership.updatedAt,
  };
};

export const toMemberResponse = (
  membership
) => {
  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    role: membership.role,
    createdAt: membership.createdAt,
    updatedAt: membership.updatedAt,

    user: membership.user
      ? {
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
          avatar: membership.user.avatar,
        }
      : undefined,
  };
};

export const toMemberListResponse = (
  members
) => {
  return members.map(toMemberResponse);
};

export const toInvitationResponse = (invitation) => {
  if (!invitation) {
    return null;
  }

  return {
    id: invitation.id,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    organizationId: invitation.organizationId,
    organization: invitation.organization,
  };
};