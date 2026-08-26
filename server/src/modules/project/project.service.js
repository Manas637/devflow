import ApiError from "../../core/ApiError.js";

import {
  HTTP_STATUS,
} from "../../constants/http.constants.js";

import {
  PROJECT_MESSAGES,
} from "./project.constants.js";

import {
  toProjectResponse,
  toProjectMembershipResponse,
  toProjectMemberResponse,
} from "./project.mapper.js";

class ProjectService {
  constructor({
    projectRepository,
    organizationRepository,
    databaseService,
    logger,
  }) {
    this.projectRepository = projectRepository;
    this.organizationRepository =
      organizationRepository;
    this.databaseService = databaseService;
    this.logger = logger;
  }

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  generateSlug(name) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async getOrganizationMembership(
    userId,
    organizationId
  ) {
    const membership =
      await this.organizationRepository.findMembership(
        userId,
        organizationId
      );

    if (!membership) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.UNAUTHORIZED_PROJECT_ACCESS
      );
    }

    return membership;
  }

  isOrganizationAdmin(role) {
    return (
      role === "OWNER" ||
      role === "ADMIN"
    );
  }

  isProjectAdmin(role) {
    return (
      role === "OWNER" ||
      role === "ADMIN"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Project Access
  |--------------------------------------------------------------------------
  */

  async getProjectAccess(
    userId,
    project
  ) {
    const organizationMembership =
      await this.getOrganizationMembership(
        userId,
        project.organizationId
      );

    /*
     * Organization OWNER/ADMIN automatically
     * have access to every project.
     */
    if (
      this.isOrganizationAdmin(
        organizationMembership.role
      )
    ) {
      return {
        organizationMembership,
        projectMembership: null,
        isOrganizationAdmin: true,
      };
    }

    const projectMembership =
      await this.projectRepository.findProjectMembership(
        userId,
        project.id
      );

    if (!projectMembership) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.UNAUTHORIZED_PROJECT_ACCESS
      );
    }

    return {
      organizationMembership,
      projectMembership,
      isOrganizationAdmin: false,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Create Project
  |--------------------------------------------------------------------------
  */

  async createProject({
    userId,
    organizationId,
    name,
    description,
  }) {
    if (!name?.trim()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        PROJECT_MESSAGES.PROJECT_NAME_REQUIRED
      );
    }

    /*
     * Only organization OWNER/ADMIN can create
     * projects.
     */
    const organizationMembership =
      await this.getOrganizationMembership(
        userId,
        organizationId
      );

    if (
      !this.isOrganizationAdmin(
        organizationMembership.role
      )
    ) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    const slug = this.generateSlug(name);

    /*
     * Slug is unique inside an organization.
     */
    const existingProject =
      await this.projectRepository.findProjectBySlug(
        organizationId,
        slug
      );

    if (existingProject) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        PROJECT_MESSAGES.PROJECT_ALREADY_EXISTS
      );
    }

    const result =
      await this.databaseService.transaction(
        async (tx) => {
          return this.projectRepository.createProjectWithOwner(
            {
              name: name.trim(),
              slug,
              description:
                description?.trim() || null,
              organizationId,
            },
            {
              userId,
              role: "OWNER",
            },
            tx
          );
        }
      );

    this.logger.info(
      {
        projectId: result.project.id,
        organizationId,
        userId,
      },
      "Project created"
    );

    return {
      project: toProjectResponse(
        result.project
      ),
      membership:
        toProjectMembershipResponse(
          result.membership
        ),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Project
  |--------------------------------------------------------------------------
  */

  async getProjectById({
    userId,
    projectId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    await this.getProjectAccess(
      userId,
      project
    );

    return toProjectResponse(project);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Projects
  |--------------------------------------------------------------------------
  */

  async getProjectsByOrganization({
    userId,
    organizationId,
  }) {
    const organizationMembership =
      await this.getOrganizationMembership(
        userId,
        organizationId
      );

    let projects;

    /*
     * Organization OWNER/ADMIN can see every
     * project in the organization.
     */
    if (
      this.isOrganizationAdmin(
        organizationMembership.role
      )
    ) {
      projects =
        await this.projectRepository.getProjectsByOrganizationId(
          organizationId
        );
    } else {
      /*
       * MEMBER/other users only see projects
       * they belong to.
       */
      projects =
        await this.projectRepository.getProjectsByUserId(
          organizationId,
          userId
        );
    }

    return projects.map(toProjectResponse);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Project
  |--------------------------------------------------------------------------
  */

  async updateProject({
    userId,
    projectId,
    name,
    description,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    /*
     * Only organization OWNER/ADMIN or
     * project OWNER/ADMIN can update.
     */
    const canUpdate =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canUpdate) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    const data = {};

    if (name !== undefined) {
      if (!name.trim()) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          PROJECT_MESSAGES.PROJECT_NAME_REQUIRED
        );
      }

      const trimmedName = name.trim();
      const slug =
        this.generateSlug(trimmedName);

      /*
       * Only check if the slug actually changes.
       */
      if (slug !== project.slug) {
        const existingProject =
          await this.projectRepository.findProjectBySlug(
            project.organizationId,
            slug
          );

        if (
          existingProject &&
          existingProject.id !== project.id
        ) {
          throw new ApiError(
            HTTP_STATUS.CONFLICT,
            PROJECT_MESSAGES.PROJECT_ALREADY_EXISTS
          );
        }
      }

      data.name = trimmedName;
      data.slug = slug;
    }

    if (description !== undefined) {
      data.description =
        description?.trim() || null;
    }

    if (
      Object.keys(data).length === 0
    ) {
      return toProjectResponse(project);
    }

    const updatedProject =
      await this.projectRepository.updateProject(
        projectId,
        data
      );

    this.logger.info(
      {
        projectId,
        userId,
      },
      "Project updated"
    );

    return toProjectResponse(
      updatedProject
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Archive Project
  |--------------------------------------------------------------------------
  */

  async archiveProject({
    userId,
    projectId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canArchive =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canArchive) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    if (project.status === "ARCHIVED") {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        PROJECT_MESSAGES.PROJECT_ALREADY_ARCHIVED
      );
    }

    const archivedProject =
      await this.projectRepository.updateProject(
        projectId,
        {
          status: "ARCHIVED",
        }
      );

    this.logger.info(
      {
        projectId,
        userId,
      },
      "Project archived"
    );

    return toProjectResponse(
      archivedProject
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Activate Project
  |--------------------------------------------------------------------------
  */

  async activateProject({
    userId,
    projectId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canActivate =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canActivate) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    if (project.status === "ACTIVE") {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        PROJECT_MESSAGES.PROJECT_ALREADY_ACTIVE
      );
    }

    const activatedProject =
      await this.projectRepository.updateProject(
        projectId,
        {
          status: "ACTIVE",
        }
      );

    this.logger.info(
      {
        projectId,
        userId,
      },
      "Project activated"
    );

    return toProjectResponse(
      activatedProject
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Project
  |--------------------------------------------------------------------------
  */

  async deleteProject({
    userId,
    projectId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canDelete =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        access.projectMembership.role ===
          "OWNER"
      );

    if (!canDelete) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    await this.projectRepository.deleteProject(
      projectId
    );

    this.logger.info(
      {
        projectId,
        userId,
      },
      "Project deleted"
    );

    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Project Members
  |--------------------------------------------------------------------------
  */

  async getProjectMembers({
    userId,
    projectId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    await this.getProjectAccess(
      userId,
      project
    );

    const members =
      await this.projectRepository.getProjectMembers(
        projectId
      );

    return members.map(
      toProjectMemberResponse
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Project Member Role
  |--------------------------------------------------------------------------
  */

  async updateProjectMemberRole({
    userId,
    projectId,
    membershipId,
    role,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canManageMembers =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canManageMembers) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    const membership =
      await this.projectRepository.findProjectMembershipById(
        membershipId
      );

    if (
      !membership ||
      membership.projectId !== projectId
    ) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.UNAUTHORIZED_PROJECT_ACCESS
      );
    }

    /*
     * OWNER cannot be casually replaced.
     * We will handle ownership transfer separately.
     */
    if (
      membership.role === "OWNER" &&
      role !== "OWNER"
    ) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    if (
      role === "OWNER" &&
      membership.role !== "OWNER"
    ) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    const updatedMembership =
      await this.projectRepository.updateProjectMembershipRole(
        membershipId,
        role
      );

    this.logger.info(
      {
        projectId,
        membershipId,
        userId,
        role,
      },
      "Project member role updated"
    );

    return toProjectMembershipResponse(
      updatedMembership
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Add Project Member
  |--------------------------------------------------------------------------
  */

  async addProjectMember({
    userId,
    projectId,
    targetUserId,
    role,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canManageMembers =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canManageMembers) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Target user must belong to organization
    |--------------------------------------------------------------------------
    */

    const organizationMembership =
      await this.organizationRepository.findMembership(
        targetUserId,
        project.organizationId
      );

    if (!organizationMembership) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        PROJECT_MESSAGES.CANNOT_ADD_NON_ORGANIZATION_MEMBER
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check existing project membership
    |--------------------------------------------------------------------------
    */

    const existingMembership =
      await this.projectRepository.findProjectMembership(
        targetUserId,
        projectId
      );

    if (existingMembership) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        PROJECT_MESSAGES.PROJECT_MEMBER_ALREADY_EXISTS
      );
    }

    /*
    |--------------------------------------------------------------------------
    | OWNER cannot be assigned through normal member management
    |--------------------------------------------------------------------------
    */

    if (role === "OWNER") {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.CANNOT_CHANGE_PROJECT_OWNER_ROLE
      );
    }

    const membership =
      await this.projectRepository.createProjectMembership({
        userId: targetUserId,
        projectId,
        role,
      });

    this.logger.info(
      {
        projectId,
        targetUserId,
        userId,
        role,
      },
      "Project member added"
    );

    return toProjectMembershipResponse(
      membership
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Project Member
  |--------------------------------------------------------------------------
  */

  async removeProjectMember({
    userId,
    projectId,
    membershipId,
  }) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const access =
      await this.getProjectAccess(
        userId,
        project
      );

    const canManageMembers =
      access.isOrganizationAdmin ||
      (
        access.projectMembership &&
        this.isProjectAdmin(
          access.projectMembership.role
        )
      );

    if (!canManageMembers) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    const membership =
      await this.projectRepository.findProjectMembershipById(
        membershipId
      );

    if (
      !membership ||
      membership.projectId !== projectId
    ) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.UNAUTHORIZED_PROJECT_ACCESS
      );
    }

    /*
     * Project OWNER cannot be removed.
     */
    if (membership.role === "OWNER") {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.INSUFFICIENT_PROJECT_PERMISSIONS
      );
    }

    await this.projectRepository.deleteProjectMembership(
      membershipId
    );

    this.logger.info(
      {
        projectId,
        membershipId,
        userId,
      },
      "Project member removed"
    );

    return null;
  }

  async getMyProjectMembership({userId, projectId}) {
    const project =
      await this.projectRepository.findProjectById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        PROJECT_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const membership =
      await this.projectRepository.findProjectMembership(
        userId,
        projectId
      );

    if (!membership) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        PROJECT_MESSAGES.UNAUTHORIZED_PROJECT_ACCESS
      );
    }

    this.logger.debug(
      {
        projectId,
        userId,
        role: membership.role,
      },
      "Project membership fetched"
    );

    return toProjectMembershipResponse(
      membership
    );
  }

  async leaveProject(userId, projectId) {
      const project =
        await this.projectRepository.findProjectById(
          projectId
        );

      if (!project) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          PROJECT_MESSAGES.PROJECT_NOT_FOUND
        );
      }

      const membership =
        await this.projectRepository.findProjectMembership(
          userId,
          projectId
        );

      if (!membership) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          PROJECT_MESSAGES.PROJECT_MEMBER_NOT_FOUND
        );
      }

      /*
      * Project OWNER cannot leave directly.
      * Ownership must be transferred first.
      */
      if (membership.role === "OWNER") {
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          PROJECT_MESSAGES.PROJECT_OWNER_CANNOT_LEAVE
        );
      }

      await this.projectRepository.deleteProjectMembership(
        membership.id
      );

      return null;
    }
}

export default ProjectService;