import api from "@/api/axios";

// Organizations

export const createOrganization = (data) =>
  api.post("/organizations", data);

export const getOrganizations = () =>
  api.get("/organizations");

export const getOrganization = (organizationId) =>
  api.get(`/organizations/${organizationId}`);

export const updateOrganization = (
  organizationId,
  data
) =>
  api.patch(
    `/organizations/${organizationId}`,
    data
  );

export const deleteOrganization = (
  organizationId
) =>
  api.delete(
    `/organizations/${organizationId}`
  );

// Members

export const getOrganizationMembers = (
  organizationId
) =>
  api.get(
    `/organizations/${organizationId}/members`
  );

export const updateMemberRole = (
  organizationId,
  memberId,
  role
) =>
  api.patch(
    `/organizations/${organizationId}/members/${memberId}`,
    { role }
  );

export const removeMember = (
  organizationId,
  memberId
) =>
  api.delete(
    `/organizations/${organizationId}/members/${memberId}`
  );

export const leaveOrganization = (
  organizationId
) =>
  api.delete(
    `/organizations/${organizationId}/leave`
  );

// Invitations

export const createInvitation = (
  organizationId,
  data
) =>
  api.post(
    `/organizations/${organizationId}/invitations`,
    data
  );

export const getInvitations = (
  organizationId
) =>
  api.get(
    `/organizations/${organizationId}/invitations`
  );

export const getInvitation = (token) =>
  api.get(
    `/organizations/invitations/${token}`
  );

export const acceptInvitation = (token) =>
  api.post(
    `/organizations/invitations/${token}/accept`
  );

export const rejectInvitation = (token) =>
  api.post(
    `/organizations/invitations/${token}/reject`
  );

export const cancelInvitation = (
  organizationId,
  invitationId
) =>
  api.delete(
    `/organizations/${organizationId}/invitations/${invitationId}`
  );

export const searchOrganizationMembers = (
  organizationId,
  search
) => 
  api.get(
    `/organizations/${organizationId}/members/search`,
    {
      params: {
        search,
      },
    }
  );