import api from "@/api/axios";

// Projects

export const createProject = (
  organizationId,
  data
) =>
  api.post(
    `/organizations/${organizationId}/projects`,
    data
  );

export const getProjectsByOrganization = (
  organizationId
) =>
  api.get(
    `/organizations/${organizationId}/projects`
  );

export const getProject = (projectId) =>
  api.get(
    `/projects/${projectId}`
  );

export const updateProject = (
  projectId,
  data
) =>
  api.patch(
    `/projects/${projectId}`,
    data
  );

export const archiveProject = (
  projectId
) =>
  api.patch(
    `/projects/${projectId}/archive`
  );

export const activateProject = (
  projectId
) =>
  api.patch(
    `/projects/${projectId}/activate`
  );

export const deleteProject = (
  projectId
) =>
  api.delete(
    `/projects/${projectId}`
  );

// Project Members

export const getProjectMembers = (
  projectId
) =>
  api.get(
    `/projects/${projectId}/members`
  );

export const getMyProjectMembership = (
  projectId
) =>
  api.get(
    `/projects/${projectId}/membership`
  );

export const addProjectMember = (
  projectId,
  data
) =>
  api.post(
    `/projects/${projectId}/members`,
    data
  );

export const updateProjectMemberRole = (
  projectId,
  membershipId,
  role
) =>
  api.patch(
    `/projects/${projectId}/members/${membershipId}`,
    { role }
  );

export const removeProjectMember = (
  projectId,
  membershipId
) =>
  api.delete(
    `/projects/${projectId}/members/${membershipId}`
  );

export const leaveProject = (
  projectId
) => {
  api.delete(
    `/projects/${projectId}/members/me`
  );
};