import ApiResponse from "../../core/ApiResponse.js";
import asyncHandler from "../../core/asyncHandler.js";

import { HTTP_STATUS } from "../../constants/http.constants.js";

import {
  ORGANIZATION_MESSAGES,
} from "./organization.constants.js";
import { toInvitationResponse, toMemberResponse } from "./organization.mapper.js";

class OrganizationController {
  constructor(organizationService) {
    this.organizationService =
      organizationService;
  }

  createOrganization = asyncHandler(
    async (req, res) => {
      const organization =
        await this.organizationService.createOrganization(
          req.user.id,
          req.validatedData
        );

      return res
        .status(HTTP_STATUS.CREATED)
        .json(
          new ApiResponse(
            HTTP_STATUS.CREATED,
            organization,
            ORGANIZATION_MESSAGES.ORGANIZATION_CREATED_SUCCESS
          )
        );
    }
  );

  getOrganizations = asyncHandler(
    async (req, res) => {
      const organizations =
        await this.organizationService.getOrganizations(
          req.user.id
        );

      return res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            organizations,
            ORGANIZATION_MESSAGES.ORGANIZATIONS_FETCHED_SUCCESS
          )
        );
    }
  );

  getOrganization = asyncHandler(
    async (req, res) => {
      const organization =
        await this.organizationService.getOrganization(
          req.user.id,
          req.validatedParams.organizationId
        );

      return res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            organization,
            ORGANIZATION_MESSAGES.ORGANIZATION_FETCHED_SUCCESS
          )
        );
    }
  );

  getMembers = asyncHandler(
    async (req, res) => {
      const members =
        await this.organizationService.getMembers(
          req.user.id,
          req.validatedParams.organizationId
        );

      return res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            members,
            ORGANIZATION_MESSAGES.MEMBERS_FETCHED_SUCCESS
          )
        );
    }
  );

  updateMemberRole = asyncHandler(
    async (req, res) => {
      const membership =
        await this.organizationService.updateMemberRole(
          req.user.id,
          req.validatedParams.organizationId,
          req.validatedParams.memberId,
          req.validatedData.role
        );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          toMemberResponse(membership),
          ORGANIZATION_MESSAGES.MEMBER_ROLE_UPDATED_SUCCESS
        )
      );
    }
  );

  removeMember = asyncHandler(
    async (req, res) => {
      await this.organizationService.removeMember(
        req.user.id,
        req.validatedParams.organizationId,
        req.validatedParams.memberId
      );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          ORGANIZATION_MESSAGES.MEMBER_REMOVED_SUCCESS
        )
      );
    }
  );

  updateOrganization = asyncHandler(async (req, res) => {
    const organization =
      await this.organizationService.updateOrganization(
        req.user.id,
        req.validatedParams.organizationId,
        req.validatedData
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        organization,
        ORGANIZATION_MESSAGES.ORGANIZATION_UPDATED_SUCCESS
      )
    );
  });

  leaveOrganization = asyncHandler(
    async (req, res) => {
      await this.organizationService.leaveOrganization(
        req.user.id,
        req.validatedParams.organizationId
      );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          ORGANIZATION_MESSAGES.ORGANIZATION_LEFT_SUCCESS
        )
      );
    }
  );

  deleteOrganization = asyncHandler(
    async (req, res) => {
      await this.organizationService.deleteOrganization(
        req.user.id,
        req.validatedParams.organizationId
      );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          ORGANIZATION_MESSAGES.ORGANIZATION_DELETED_SUCCESS
        )
      );
    }
  );
  // --------------------------------------------------------------------------
  // Invitations
  // --------------------------------------------------------------------------

  createInvitation = asyncHandler(async (req, res) => {
    const { email, role } = req.validatedData;

    const result =
      await this.organizationService.createInvitation(
        req.user.id,
        req.validatedParams.organizationId,
        email,
        role
      );

    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        result,
        ORGANIZATION_MESSAGES.INVITATION_CREATED_SUCCESS
      )
    );
  });

  getInvitations = asyncHandler(async (req, res) => {
    const invitations =
      await this.organizationService.getInvitations(
        req.user.id,
        req.validatedParams.organizationId
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        invitations,
        ORGANIZATION_MESSAGES.INVITATIONS_FETCHED_SUCCESS
      )
    );
  });

  cancelInvitation = asyncHandler(async (req, res) => {
    await this.organizationService.cancelInvitation(
      req.user.id,
      req.params.organizationId,
      req.validatedParams.invitationId
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        ORGANIZATION_MESSAGES.INVITATION_CANCELLED_SUCCESS
      )
    );
  });

  getInvitationByToken = asyncHandler(
    async (req, res) => {
      const invitation =
        await this.organizationService.getInvitationByToken(
          req.validatedParams.token,
          req.user?.id ?? null
        );

      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(
          HTTP_STATUS.OK,
          invitation,
          ORGANIZATION_MESSAGES.INVITATION_FETCHED_SUCCESS
        )
      );
    }
  );

  acceptInvitation = asyncHandler(async (req, res) => {
    const membership =
      await this.organizationService.acceptInvitation(
        req.user.id,
        req.validatedParams.token
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        membership,
        ORGANIZATION_MESSAGES.INVITATION_ACCEPTED_SUCCESS
      )
    );
  });

  rejectInvitation = asyncHandler(async (req, res) => {
    await this.organizationService.rejectInvitation(
      req.user.id,
      req.validatedParams.token
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        ORGANIZATION_MESSAGES.INVITATION_REJECTED_SUCCESS
      )
    );
  });

  searchMembers = asyncHandler(async (req,res) => {
    const members =
      await this.organizationService.searchMembers(
        req.user.id,
        req.validatedParams.organizationId,
        req.validatedQuery.search
      );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        members,
      )
    );
  });
}

export default OrganizationController;