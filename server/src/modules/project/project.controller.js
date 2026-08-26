import asyncHandler from "../../core/asyncHandler.js";
import ApiResponse from "../../core/ApiResponse.js";

import { HTTP_STATUS } from "../../constants/http.constants.js";
import { PROJECT_MESSAGES } from "./project.constants.js";

class ProjectController {
  constructor(projectService) {
    this.projectService =
      projectService;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Project
  |--------------------------------------------------------------------------
  */

  createProject = asyncHandler(
    async (req, res) => {
      const {
        organizationId,
      } = req.validatedParams;

      const {
        name,
        description,
      } = req.validatedData;

      const result =
        await this.projectService.createProject({
          userId: req.user.id,
          organizationId,
          name,
          description,
        });

      return res.status(
        HTTP_STATUS.CREATED
      ).json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          result,
          PROJECT_MESSAGES.PROJECT_CREATED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get Projects
  |--------------------------------------------------------------------------
  */

  getProjectsByOrganization = asyncHandler(
    async (req, res) => {
      const {
        organizationId,
      } = req.validatedParams;

      const projects =
        await this.projectService.getProjectsByOrganization({
          userId: req.user.id,
          organizationId,
        });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          projects,
          PROJECT_MESSAGES.PROJECTS_FETCHED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get Project
  |--------------------------------------------------------------------------
  */

  getProject = asyncHandler(
    async (req, res) => {
      const {
        projectId,
      } = req.validatedParams;

      const project =
        await this.projectService.getProjectById({
          userId: req.user.id,
          projectId,
        });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          project,
          PROJECT_MESSAGES.PROJECT_FETCHED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Update Project
  |--------------------------------------------------------------------------
  */

  updateProject = asyncHandler(
    async (req, res) => {
      const {
        projectId,
      } = req.validatedParams;

      const {
        name,
        description,
      } = req.validatedData;

      const project =
        await this.projectService.updateProject({
          userId: req.user.id,
          projectId,
          name,
          description,
        });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          project,
          PROJECT_MESSAGES.PROJECT_UPDATED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Archive Project
  |--------------------------------------------------------------------------
  */

  archiveProject = asyncHandler(
    async (req, res) => {
      const {
        projectId,
      } = req.validatedParams;

      const project =
        await this.projectService.archiveProject({
          userId: req.user.id,
          projectId,
        });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          project,
          PROJECT_MESSAGES.PROJECT_ARCHIVED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Delete Project
  |--------------------------------------------------------------------------
  */

  deleteProject = asyncHandler(
    async (req, res) => {
      const {
        projectId,
      } = req.validatedParams;

      await this.projectService.deleteProject({
        userId: req.user.id,
        projectId,
      });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          PROJECT_MESSAGES.PROJECT_DELETED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Project Members
  |--------------------------------------------------------------------------
  */

  getProjectMembers = asyncHandler(
    async (req, res) => {
      const {
        projectId,
      } = req.validatedParams;

      const members =
        await this.projectService.getProjectMembers({
          userId: req.user.id,
          projectId,
        });

      return res.status(
        HTTP_STATUS.OK
      ).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          members,
          PROJECT_MESSAGES.PROJECT_MEMBERS_FETCHED_SUCCESS
        )
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | My Project Membership
  |--------------------------------------------------------------------------
  */

  getMyProjectMembership =
    asyncHandler(
      async (req, res) => {
        const {
          projectId,
        } = req.validatedParams;

        const membership =
          await this.projectService.getMyProjectMembership({
            userId: req.user.id,
            projectId,
          });

        return res.status(
          HTTP_STATUS.OK
        ).json(
          new ApiResponse(
            HTTP_STATUS.OK,
            membership,
            PROJECT_MESSAGES.PROJECT_MEMBERSHIP_FETCHED_SUCCESS
          )
        );
      }
    );
  
    /*
    |--------------------------------------------------------------------------
    | Activate Project
    |--------------------------------------------------------------------------
    */

    activateProject = asyncHandler(
      async (req, res) => {
        const {
          projectId,
        } = req.validatedParams;

        const project =
          await this.projectService.activateProject({
            userId: req.user.id,
            projectId,
          });

        return res.status(
          HTTP_STATUS.OK
        ).json(
          new ApiResponse(
            HTTP_STATUS.OK,
            project,
            PROJECT_MESSAGES.PROJECT_ACTIVATED_SUCCESS
          )
        );
      }
  );
  
    /*
    |--------------------------------------------------------------------------
    | Add Project Member
    |--------------------------------------------------------------------------
    */

    addProjectMember = asyncHandler(
      async (req, res) => {
        const {
          projectId,
        } = req.validatedParams;

        const {
          userId,
          role,
        } = req.validatedData;

        const membership =
          await this.projectService.addProjectMember({
            userId: req.user.id,
            projectId,
            targetUserId: userId,
            role,
          });

        return res.status(
          HTTP_STATUS.CREATED
        ).json(
          new ApiResponse(
            HTTP_STATUS.CREATED,
            membership,
            PROJECT_MESSAGES.PROJECT_MEMBER_ADDED_SUCCESS
          )
        );
      }
  );
  
    /*
  |--------------------------------------------------------------------------
  | Update Project Member Role
  |--------------------------------------------------------------------------
  */

  updateProjectMemberRole =
    asyncHandler(
      async (req, res) => {
        const {
          projectId,
          membershipId,
        } = req.validatedParams;

        const {
          role,
        } = req.validatedData;

        const membership =
          await this.projectService.updateProjectMemberRole({
            userId: req.user.id,
            projectId,
            membershipId,
            role,
          });

        return res.status(
          HTTP_STATUS.OK
        ).json(
          new ApiResponse(
            HTTP_STATUS.OK,
            membership,
            PROJECT_MESSAGES.PROJECT_MEMBER_ROLE_UPDATED_SUCCESS
          )
        );
      }
    );
  
    /*
    |--------------------------------------------------------------------------
    | Remove Project Member
    |--------------------------------------------------------------------------
    */

    removeProjectMember =
      asyncHandler(
        async (req, res) => {
          const {
            projectId,
            membershipId,
          } = req.validatedParams;

          await this.projectService.removeProjectMember({
            userId: req.user.id,
            projectId,
            membershipId,
          });

          return res.status(
            HTTP_STATUS.OK
          ).json(
            new ApiResponse(
              HTTP_STATUS.OK,
              null,
              PROJECT_MESSAGES.PROJECT_MEMBER_REMOVED_SUCCESS
            )
          );
        }
      );

  leaveProject = asyncHandler(async (req,res) => {
    await this.projectService.leaveProject(
      req.user.id,
      req.params.projectId
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        "You left the project successfully."
      )
    );
  });
}

export default ProjectController;