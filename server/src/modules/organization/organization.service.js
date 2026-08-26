import ApiError from "../../core/ApiError.js";

import { HTTP_STATUS } from "../../constants/http.constants.js";

import {
  ORGANIZATION_MESSAGES,
  ORGANIZATION_PERMISSIONS,
} from "./organization.constants.js";

import {
  toOrganizationResponse,
  toOrganizationListResponse,
  toMemberListResponse,
  toInvitationResponse,
} from "./organization.mapper.js";

import {
  generateInvitationToken,
  hashInvitationToken,
  getInvitationExpiry,
} from "./invitation.utils.js";

class OrganizationService {
  constructor({
    organizationRepository,
    databaseService,
    logger,
    userRepository,
    emailQueueService
  }) {
    this.organizationRepository =
      organizationRepository;

    this.databaseService = databaseService;

    this.logger = logger;
      
    this.userRepository = userRepository;

    this.emailQueueService = emailQueueService;
  }

  generateSlug(name) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ORGANIZATION_MESSAGES.ORGANIZATION_NAME_REQUIRED
      );
    }

    return slug;
  }

  async generateUniqueSlug(name, db) {
    const baseSlug = this.generateSlug(name);

    let slug = baseSlug;
    let counter = 2;

    while (
      await this.organizationRepository.findOrganizationBySlug(
        slug,
        db
      )
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
    }
    
    async requireMembership(userId, organizationId) {
        const membership =
            await this.organizationRepository.findMembership(
            userId,
            organizationId
            );

        if (!membership) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.NOT_A_MEMBER
            );
        }

        return membership;
    }

    requireRole(membership, allowedRoles) {
    if (!allowedRoles.includes(membership.role)) {
        throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        ORGANIZATION_MESSAGES.INSUFFICIENT_PERMISSIONS
        );
    }

    return membership;
    }

    async requireOrganizationRole(
        userId,
        organizationId,
        allowedRoles
        ) {
        const membership =
            await this.requireMembership(
            userId,
            organizationId
            );

        return this.requireRole(
            membership,
            allowedRoles
        );
    }

  async createOrganization(userId, organizationData) {
    const name = organizationData.name.trim();

    const organization =
      await this.databaseService.transaction(
        async (tx) => {
          const slug =
            await this.generateUniqueSlug(
              name,
              tx
            );

          const organization =
            await this.organizationRepository.createOrganization(
              {
                name,
                slug,
              },
              tx
            );

          await this.organizationRepository.createMembership(
            {
              userId,
              organizationId: organization.id,
              role: "OWNER",
            },
            tx
          );

          return organization;
        }
      );

    this.logger.info(
      {
        userId,
        organizationId: organization.id,
      },
      ORGANIZATION_MESSAGES.ORGANIZATION_CREATED_SUCCESS
    );

    return toOrganizationResponse(
      organization
    );
  }

  async getOrganizations(userId) {
    const organizations =
      await this.organizationRepository.getOrganizationsByUserId(
        userId
      );

    return toOrganizationListResponse(
      organizations
    );
  }

  async getOrganization(userId, organizationId) {
    await this.requireMembership(
        userId,
        organizationId
    );

    const organization =
        await this.organizationRepository.findOrganizationById(
        organizationId
        );

    if (!organization) {
        throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND
        );
    }

    const membership = await this.organizationRepository.findMembership(userId, organizationId);

    const final_organization = toOrganizationResponse(organization);
    
      return {
          ...final_organization,
          role: membership.role
    }
  }

  async getMembers(userId, organizationId) {
    await this.requireMembership(
        userId,
        organizationId
    );

    const members =
        await this.organizationRepository.getOrganizationMembers(
        organizationId
        );

    return toMemberListResponse(members);
    }
    
    async updateMemberRole(
        userId,
        organizationId,
        memberId,
        role
        ) {
        const currentOwner =
            await this.requireOrganizationRole(
            userId,
            organizationId,
            ["OWNER"]
            );

        const targetMembership =
            await this.organizationRepository.findMembershipById(
            memberId
            );

        if (!targetMembership) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.MEMBER_NOT_FOUND
            );
        }

        if (
            targetMembership.organizationId !==
            organizationId
        ) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.MEMBER_NOT_FOUND
            );
        }

        if (targetMembership.userId === userId) {
            throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            ORGANIZATION_MESSAGES.CANNOT_MODIFY_SELF
            );
        }

        if (targetMembership.role === role) {
            return targetMembership;
        }

        // Ownership transfer
        if (role === "OWNER") {
            return this.databaseService.transaction(
            async (tx) => {
                await this.organizationRepository.updateMembershipRole(
                currentOwner.id,
                "ADMIN",
                tx
                );

                return this.organizationRepository.updateMembershipRole(
                targetMembership.id,
                "OWNER",
                tx
                );
            }
            );
        }

        // Normal ADMIN/MEMBER role change
        if (targetMembership.role === "OWNER") {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.CANNOT_MODIFY_OWNER
            );
        }

        return this.organizationRepository.updateMembershipRole(
            targetMembership.id,
            role
        );
    }

    async removeMember(
        userId,
        organizationId,
        memberId
        ) {
        const requester =
            await this.requireMembership(
            userId,
            organizationId
            );

        const targetMembership =
            await this.organizationRepository.findMembershipById(
            memberId
            );

        if (!targetMembership) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.MEMBER_NOT_FOUND
            );
        }

        if (
            targetMembership.organizationId !==
            organizationId
        ) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.MEMBER_NOT_FOUND
            );
        }

        if (targetMembership.userId === userId) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.CANNOT_REMOVE_SELF
            );
        }

        if (targetMembership.role === "OWNER") {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.CANNOT_REMOVE_OWNER
            );
        }

        if (
            requester.role === "ADMIN" &&
            targetMembership.role === "ADMIN"
        ) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.INSUFFICIENT_PERMISSIONS
            );
        }

        await this.organizationRepository.deleteMembership(
            targetMembership.id
        );

        this.logger.info(
            {
            userId,
            organizationId,
            memberId: targetMembership.id,
            },
            ORGANIZATION_MESSAGES.MEMBER_REMOVED_SUCCESS
        );
        }
    
    async updateOrganization(
        userId,
        organizationId,
        organizationData
        ) {
        await this.requireOrganizationRole(
            userId,
            organizationId,
            ORGANIZATION_PERMISSIONS.UPDATE
        );

        const organization =
            await this.organizationRepository.findOrganizationById(
            organizationId
            );

        if (!organization) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND
            );
        }

        const name = organizationData.name.trim();

        if (name === organization.name) {
            throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            ORGANIZATION_MESSAGES.NO_ORGANIZATION_CHANGES
            );
        }

        const updatedOrganization =
            await this.databaseService.transaction(
            async (tx) => {
                const slug =
                await this.generateUniqueSlug(
                    name,
                    tx
                );

                return this.organizationRepository.updateOrganization(
                organizationId,
                {
                    name,
                    slug,
                },
                tx
                );
            }
            );

        this.logger.info(
            {
            userId,
            organizationId,
            },
            ORGANIZATION_MESSAGES.ORGANIZATION_UPDATED_SUCCESS
        );

        return toOrganizationResponse(
            updatedOrganization
        );
    }

    async deleteOrganization(
        userId,
        organizationId
        ) {
        await this.requireOrganizationRole(
            userId,
            organizationId,
            ["OWNER"]
        );

        const organization =
            await this.organizationRepository.findOrganizationById(
            organizationId
            );

        if (!organization) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND
            );
        }

        await this.organizationRepository.deleteOrganization(
            organizationId
        );

        this.logger.info(
            {
            userId,
            organizationId,
            },
            ORGANIZATION_MESSAGES.ORGANIZATION_DELETED_SUCCESS
        );
    }

    async leaveOrganization(userId, organizationId) {
        const membership =
            await this.requireMembership(
            userId,
            organizationId
            );

        // Owner must transfer ownership first.
        if (membership.role === "OWNER") {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.OWNER_MUST_TRANSFER_OWNERSHIP
            );
        }

        await this.organizationRepository.deleteMembership(
            membership.id
        );

        this.logger.info(
            {
            userId,
            organizationId,
            membershipId: membership.id,
            },
            ORGANIZATION_MESSAGES.ORGANIZATION_LEFT_SUCCESS
        );
    }

    async createInvitation(
        userId,
        organizationId,
        email,
        role
        ) {
        const membership =
            await this.requireOrganizationRole(
            userId,
            organizationId,
            ["OWNER", "ADMIN"]
            );

        const normalizedEmail =
            email.trim().toLowerCase();

        /*
        * Prevent inviting an existing member.
        */
        const existingMembership =
            await this.organizationRepository.findMembershipByUserEmail(
            normalizedEmail,
            organizationId
            );

        if (existingMembership) {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.ALREADY_A_MEMBER
            );
        }

        /*
        * Prevent multiple pending invitations
        * for the same email in the same organization.
        */
        const existingInvitation =
            await this.organizationRepository.findPendingInvitation(
            organizationId,
            normalizedEmail
            );

        if (existingInvitation) {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.INVITATION_ALREADY_EXISTS
            );
        }

        /*
        * ADMIN can invite MEMBERs.
        * Only OWNER can invite ADMINs.
        */
        if (
            membership.role === "ADMIN" &&
            role === "ADMIN"
        ) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.INSUFFICIENT_PERMISSIONS
            );
        }

        /*
        * Generate a raw token for the email.
        * Only the hash is stored in the database.
        */
        const rawToken =
            generateInvitationToken();

        const tokenHash =
            hashInvitationToken(rawToken);

        const expiresAt =
            getInvitationExpiry(7);

        /*
        * Create the invitation in a transaction.
        */
        const invitation =
            await this.databaseService.transaction(
            async (tx) => {
                return this.organizationRepository.createInvitation(
                {
                    email: normalizedEmail,
                    role,
                    tokenHash,
                    expiresAt,
                    organizationId,
                    invitedById: userId,
                },
                tx
                );
            }
            );

        /*
        * Get organization information for the email.
        */
        const organization =
            await this.organizationRepository.findOrganizationById(
            organizationId
            );

        /*
        * Queue the email only after the database
        * transaction has successfully committed.
        */
        await this.emailQueueService
            .addOrganizationInvitationEmailJob({
            email: normalizedEmail,
            name: normalizedEmail.split("@")[0],
            organizationName: organization.name,
            role,
            token: rawToken,
        });

        this.logger.info(
            {
            userId,
            organizationId,
            invitationId: invitation.id,
            email: normalizedEmail,
            role,
            },
            ORGANIZATION_MESSAGES.INVITATION_CREATED_SUCCESS
        );

        return invitation;
    }

    async getInvitations(
        userId,
        organizationId
        ) {
        await this.requireOrganizationRole(
            userId,
            organizationId,
            ["OWNER", "ADMIN"]
        );

        return this.organizationRepository
            .getOrganizationInvitations(
            organizationId
        );
    }

    async getInvitation(userId, invitationId) {
        const invitation =
            await this.organizationRepository.findInvitationById(
            invitationId
            );

        if (!invitation) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.INVITATION_NOT_FOUND
            );
        }

        await this.requireOrganizationRole(
            userId,
            invitation.organizationId,
            ["OWNER", "ADMIN"]
        );

        return toInvitationResponse(invitation);
    }

    async getInvitationByToken(token, userId = null) {
        const tokenHash = hashInvitationToken(token);

        const invitation =
            await this.organizationRepository.findInvitationByTokenHash(
            tokenHash
            );

        if (!invitation) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.INVALID_INVITATION
            );
        }

        if (invitation.status === "ACCEPTED") {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.INVITATION_ALREADY_ACCEPTED
            );
        }

        if (invitation.status === "REJECTED") {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.INVITATION_ALREADY_REJECTED
            );
        }

        if (invitation.expiresAt <= new Date()) {
            throw new ApiError(
            HTTP_STATUS.GONE,
            ORGANIZATION_MESSAGES.INVITATION_EXPIRED
            );
        }

        /*
        * Determine whether the currently authenticated
        * user is the user this invitation was sent to.
        *
        * We do NOT return the invitation email.
        */
        let canAccept = false;

        if (userId) {
            const user =
            await this.userRepository.findUserById(userId);

            if (user) {
            canAccept =
                user.email.toLowerCase() ===
                invitation.email.toLowerCase();
            }
        }

        return {
            ...toInvitationResponse(invitation),
            canAccept,
        };
        }

    async cancelInvitation(
        userId,
        organizationId,
        invitationId
        ) {
        await this.requireOrganizationRole(
            userId,
            organizationId,
            ["OWNER", "ADMIN"]
        );

        const invitation =
            await this.organizationRepository
            .findInvitationById(
                invitationId
            );

        if (
            !invitation ||
            invitation.organizationId !== organizationId
        ) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.INVITATION_NOT_FOUND
            );
        }

        if (invitation.status !== "PENDING") {
            throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            ORGANIZATION_MESSAGES.INVALID_INVITATION
            );
        }

        return this.organizationRepository
            .deleteInvitation(
            invitationId
        );
    }

    async acceptInvitation(
        userId,
        token
        ) {
        const tokenHash =
            hashInvitationToken(token);

        const invitation =
            await this.organizationRepository
            .findInvitationByTokenHash(
                tokenHash
            );

        if (!invitation) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.INVALID_INVITATION
            );
        }

        if (invitation.status === "ACCEPTED") {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.INVITATION_ALREADY_ACCEPTED
            );
        }

        if (invitation.status === "REJECTED") {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.INVITATION_ALREADY_REJECTED
            );
        }

        if (
            invitation.expiresAt <= new Date()
        ) {
            throw new ApiError(
            HTTP_STATUS.GONE,
            ORGANIZATION_MESSAGES.INVITATION_EXPIRED
            );
        }

        const user =
            await this.userRepository.findUserById(
            userId
            );

        if (
            user.email.toLowerCase() !==
            invitation.email.toLowerCase()
        ) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.INVITATION_EMAIL_MISMATCH
            );
        }

        const membership =
            await this.organizationRepository
            .findMembership(
                userId,
                invitation.organizationId
            );

        if (membership) {
            throw new ApiError(
            HTTP_STATUS.CONFLICT,
            ORGANIZATION_MESSAGES.ALREADY_A_MEMBER
            );
        }

        const result =
            await this.databaseService.transaction(
            async (tx) => {
                const membership =
                await this.organizationRepository
                    .createMembership(
                    {
                        userId,
                        organizationId:
                        invitation.organizationId,
                        role: invitation.role,
                    },
                    tx
                    );

                await this.organizationRepository
                .updateInvitationStatus(
                    invitation.id,
                    "ACCEPTED",
                    tx
                );

                return membership;
            }
            );

        this.logger.info(
            {
            userId,
            organizationId:
                invitation.organizationId,
            invitationId: invitation.id,
            },
            ORGANIZATION_MESSAGES.INVITATION_ACCEPTED_SUCCESS
        );

        return result;
    }

    async rejectInvitation(
        userId,
        token
        ) {
        const tokenHash =
            hashInvitationToken(token);

        const invitation =
            await this.organizationRepository
            .findInvitationByTokenHash(
                tokenHash
            );

        if (!invitation) {
            throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            ORGANIZATION_MESSAGES.INVALID_INVITATION
            );
        }

        if (invitation.status !== "PENDING") {
            throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            ORGANIZATION_MESSAGES.INVALID_INVITATION
            );
        }

        if (
            invitation.expiresAt <= new Date()
        ) {
            throw new ApiError(
            HTTP_STATUS.GONE,
            ORGANIZATION_MESSAGES.INVITATION_EXPIRED
            );
        }

        const user =
            await this.userRepository.findUserById(
            userId
            );

        if (
            user.email.toLowerCase() !==
            invitation.email.toLowerCase()
        ) {
            throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            ORGANIZATION_MESSAGES.INVITATION_EMAIL_MISMATCH
            );
        }

        return this.organizationRepository
            .updateInvitationStatus(
            invitation.id,
            "REJECTED"
        );
    }

    async searchMembers(
        userId,
        organizationId,
        search
        ) {
        await this.requireMembership(
            userId,
            organizationId
        );

        const normalizedSearch =
            search?.trim();

        if (!normalizedSearch) {
            return [];
        }

        const members =
            await this.organizationRepository.searchOrganizationMembers(
            organizationId,
            normalizedSearch
            );

        return toMemberListResponse(members);
    }
}

export default OrganizationService;