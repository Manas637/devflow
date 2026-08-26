export const ORGANIZATION_MESSAGES = {
  ORGANIZATION_CREATED_SUCCESS:
    "Organization created successfully.",

  ORGANIZATIONS_FETCHED_SUCCESS:
    "Organizations fetched successfully.",

  ORGANIZATION_FETCHED_SUCCESS:
    "Organization fetched successfully.",

  MEMBERS_FETCHED_SUCCESS:
    "Organization members fetched successfully.",

  ORGANIZATION_UPDATED_SUCCESS:
    "Organization updated successfully.",

  ORGANIZATION_DELETED_SUCCESS:
    "Organization deleted successfully.",

  MEMBER_ROLE_UPDATED_SUCCESS:
    "Member role updated successfully.",

  MEMBER_REMOVED_SUCCESS:
    "Member removed successfully.",

  NOT_A_MEMBER:
    "You are not a member of this organization.",

  INSUFFICIENT_PERMISSIONS:
    "You do not have permission to perform this action.",

  ORGANIZATION_NOT_FOUND:
    "Organization not found.",

  MEMBER_NOT_FOUND:
    "Organization member not found.",

  CANNOT_REMOVE_OWNER:
    "The organization owner cannot be removed.",

  CANNOT_MODIFY_OWNER:
    "The organization owner cannot be modified.",
  
  CANNOT_MODIFY_SELF:
    "You cannot modify yourself.",
  
  CANNOT_REMOVE_SELF:
    "You cannot remove yourself from the organization.",
  
  OWNER_MUST_TRANSFER_OWNERSHIP:
    "Transfer ownership before leaving the organization.",

  ORGANIZATION_LEFT_SUCCESS:
    "You have left the organization successfully.",

  // Invitations
  INVITATION_CREATED_SUCCESS:
    "Invitation sent successfully.",
  
  INVITATION_FETCHED_SUCCESS:
      "Invitation fetched successfully.",

  INVITATIONS_FETCHED_SUCCESS:
    "Organization invitations fetched successfully.",

  INVITATION_CANCELLED_SUCCESS:
    "Invitation cancelled successfully.",

  INVITATION_ACCEPTED_SUCCESS:
    "Invitation accepted successfully.",

  INVITATION_REJECTED_SUCCESS:
    "Invitation rejected successfully.",

  INVITATION_NOT_FOUND:
    "Invitation not found.",

  INVITATION_EXPIRED:
    "This invitation has expired.",

  INVITATION_ALREADY_ACCEPTED:
    "This invitation has already been accepted.",

  INVITATION_ALREADY_REJECTED:
    "This invitation has already been rejected.",

  INVITATION_CANCELLED:
    "This invitation has been cancelled.",

  INVITATION_EMAIL_MISMATCH:
    "This invitation was sent to a different email address.",

  INVITATION_ALREADY_EXISTS:
    "A pending invitation already exists for this email address.",

  ALREADY_A_MEMBER:
    "This user is already a member of the organization.",

  INVALID_INVITATION:
    "Invalid or expired invitation.",
};

export const ORGANIZATION_ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const ORGANIZATION_PERMISSIONS = {
  VIEW: ["OWNER", "ADMIN", "MEMBER"],
  UPDATE: ["OWNER", "ADMIN"],
  DELETE: ["OWNER"],
  MANAGE_MEMBERS: ["OWNER", "ADMIN"],
  MANAGE_ROLES: ["OWNER"],
};