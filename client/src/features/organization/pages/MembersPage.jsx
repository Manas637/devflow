import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  MoreHorizontal,
  Shield,
  UserMinus,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useAuth from "@/features/auth/hooks/useAuth";

import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";

import useGetOrganizationMembers from "@/features/organization/hooks/useGetOrganizationMembers";

import useUpdateMemberRole from "@/features/organization/hooks/useUpdateMemberRole";

import useRemoveMember from "@/features/organization/hooks/useRemoveMember";

import useLeaveOrganization from "@/features/organization/hooks/useLeaveOrganization";


/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getMemberId = (member) => {
  return (
    member?.id ??
    member?.memberId ??
    null
  );
};

const getMemberUserId = (member) => {
  return (
    member?.user?.id ??
    member?.userId ??
    null
  );
};

const getMemberName = (member) => {
  return (
    member?.user?.name ??
    member?.name ??
    "Unknown user"
  );
};

const getMemberEmail = (member) => {
  return (
    member?.user?.email ??
    member?.email ??
    ""
  );
};

const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
};


/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function MembersPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    organization,
    isLoading: organizationLoading,
  } = useCurrentOrganization();

  const organizationId =
    organization?.id;


  /* ------------------------------------------------------------------------ */
  /* Members                                                                  */
  /* ------------------------------------------------------------------------ */

  const {
    data,
    isLoading: membersLoading,
    isError: membersError,
    error: membersErrorData,
  } = useGetOrganizationMembers(
    organizationId
  );

  /*
   * Supports:
   *
   * response.data.data
   *
   * and:
   *
   * response.data
   */

  const members = useMemo(() => {
    if (
      Array.isArray(data?.data?.data)
    ) {
      return data.data.data;
    }

    if (
      Array.isArray(data?.data)
    ) {
      return data.data;
    }

    return [];
  }, [data]);


  /* ------------------------------------------------------------------------ */
  /* Mutations                                                                */
  /* ------------------------------------------------------------------------ */

  const updateMemberRoleMutation =
    useUpdateMemberRole();

  const removeMemberMutation =
    useRemoveMember();

  const leaveOrganizationMutation =
    useLeaveOrganization();


  /* ------------------------------------------------------------------------ */
  /* Dialog state                                                             */
  /* ------------------------------------------------------------------------ */

  const [
    selectedMember,
    setSelectedMember,
  ] = useState(null);

  const [
    dialogType,
    setDialogType,
  ] = useState(null);


  const closeDialog = () => {
    setDialogType(null);
    setSelectedMember(null);
  };


  /* ------------------------------------------------------------------------ */
  /* Current member                                                           */
  /* ------------------------------------------------------------------------ */

  const currentMember = useMemo(() => {
    if (!user || members.length === 0) {
      return null;
    }

    return (
      members.find((member) => {
        const memberUserId =
          getMemberUserId(member);

        const memberEmail =
          getMemberEmail(member);

        const sameUserId =
          Boolean(
            memberUserId &&
            user?.id &&
            memberUserId === user.id
          );

        const sameEmail =
          Boolean(
            memberEmail &&
            user?.email &&
            memberEmail.toLowerCase() ===
              user.email.toLowerCase()
          );

        return (
          sameUserId ||
          sameEmail
        );
      }) ?? null
    );
  }, [members, user]);


  const currentUserRole =
    currentMember?.role ?? null;

  const isOwner =
    currentUserRole === "OWNER";

  const isAdmin =
    currentUserRole === "ADMIN";


  /* ------------------------------------------------------------------------ */
  /* Current user                                                             */
  /* ------------------------------------------------------------------------ */

  const isCurrentUser = (member) => {
    const memberUserId =
      getMemberUserId(member);

    const memberEmail =
      getMemberEmail(member);

    const sameUserId =
      Boolean(
        memberUserId &&
        user?.id &&
        memberUserId === user.id
      );

    const sameEmail =
      Boolean(
        memberEmail &&
        user?.email &&
        memberEmail.toLowerCase() ===
          user.email.toLowerCase()
      );

    return (
      sameUserId ||
      sameEmail
    );
  };


  /* ------------------------------------------------------------------------ */
  /* Permissions                                                              */
  /* ------------------------------------------------------------------------ */

  /*
   * OWNER:
   *   - Can manage ADMIN
   *   - Can manage MEMBER
   *
   * ADMIN:
   *   - Can manage MEMBER only
   *
   * Nobody can manage:
   *   - themselves
   *   - OWNER
   */

  const canManageMember = (member) => {
    if (isCurrentUser(member)) {
      return false;
    }

    if (member?.role === "OWNER") {
      return false;
    }

    if (isOwner) {
      return (
        member?.role === "ADMIN" ||
        member?.role === "MEMBER"
      );
    }

    if (isAdmin) {
      return member?.role === "MEMBER";
    }

    return false;
  };


  /* ------------------------------------------------------------------------ */
  /* Open dialogs                                                             */
  /* ------------------------------------------------------------------------ */

  const openRoleDialog = (
    member,
    role
  ) => {
    if (!isOwner) {
      return;
    }

    setSelectedMember(member);

    setDialogType(
      role === "ADMIN"
        ? "make-admin"
        : "make-member"
    );
  };


  const openTransferDialog = (
    member
  ) => {
    if (!isOwner) {
      return;
    }

    setSelectedMember(member);
    setDialogType("transfer");
  };


  const openRemoveDialog = (
    member
  ) => {
    if (!canManageMember(member)) {
      return;
    }

    setSelectedMember(member);
    setDialogType("remove");
  };


  const openLeaveDialog = () => {
    if (isOwner) {
      return;
    }

    setDialogType("leave");
  };


  /* ------------------------------------------------------------------------ */
  /* Update member role                                                       */
  /* ------------------------------------------------------------------------ */

  const handleRoleChange = (
    member,
    role
  ) => {
    if (!isOwner) {
      toast.error(
        "Only the organization owner can change member roles."
      );

      return;
    }

    if (!organizationId) {
      return;
    }

    if (!member) {
      return;
    }

    if (isCurrentUser(member)) {
      toast.error(
        "You cannot change your own role."
      );

      return;
    }

    const memberId =
      getMemberId(member);

    if (!memberId) {
      toast.error(
        "Member could not be identified."
      );

      return;
    }

    updateMemberRoleMutation.mutate(
      {
        organizationId,
        memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success(
            role === "ADMIN"
              ? `${getMemberName(member)} is now an admin.`
              : `${getMemberName(member)} is now a member.`
          );

          closeDialog();
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ??
              error?.message ??
              "Failed to update member role."
          );
        },
      }
    );
  };


  /* ------------------------------------------------------------------------ */
  /* Transfer ownership                                                       */
  /* ------------------------------------------------------------------------ */

  const handleTransferOwnership = () => {
    if (!isOwner) {
      toast.error(
        "Only the organization owner can transfer ownership."
      );

      return;
    }

    if (!organizationId) {
      return;
    }

    if (!selectedMember) {
      return;
    }

    if (isCurrentUser(selectedMember)) {
      toast.error(
        "You already own this organization."
      );

      return;
    }

    const memberId =
      getMemberId(selectedMember);

    if (!memberId) {
      toast.error(
        "Member could not be identified."
      );

      return;
    }

    updateMemberRoleMutation.mutate(
      {
        organizationId,
        memberId,
        role: "OWNER",
      },
      {
        onSuccess: () => {
          toast.success(
            `Ownership transferred to ${getMemberName(
              selectedMember
            )}.`
          );

          closeDialog();
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ??
              error?.message ??
              "Failed to transfer ownership."
          );
        },
      }
    );
  };


  /* ------------------------------------------------------------------------ */
  /* Remove member                                                            */
  /* ------------------------------------------------------------------------ */

  const handleRemoveMember = () => {
    if (!organizationId) {
      return;
    }

    if (!selectedMember) {
      return;
    }

    if (
      !canManageMember(
        selectedMember
      )
    ) {
      toast.error(
        isAdmin
          ? "Admins can only remove members."
          : "You do not have permission to remove this member."
      );

      return;
    }

    const memberId =
      getMemberId(selectedMember);

    if (!memberId) {
      toast.error(
        "Member could not be identified."
      );

      return;
    }

    removeMemberMutation.mutate(
      {
        organizationId,
        memberId,
      },
      {
        onSuccess: () => {
          toast.success(
            `${getMemberName(
              selectedMember
            )} was removed from the organization.`
          );

          closeDialog();
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ??
              error?.message ??
              "Failed to remove member."
          );
        },
      }
    );
  };


  /* ------------------------------------------------------------------------ */
  /* Leave organization                                                       */
  /* ------------------------------------------------------------------------ */

  const handleLeaveOrganization = () => {
    if (!organizationId) {
      return;
    }

    if (isOwner) {
      toast.error(
        "Transfer ownership before leaving the organization."
      );

      return;
    }

    leaveOrganizationMutation.mutate(
      {
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success(
            "You left the organization."
          );

          closeDialog();

          navigate("/dashboard");
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ??
              error?.message ??
              "Failed to leave organization."
          );
        },
      }
    );
  };


  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (
    organizationLoading ||
    membersLoading
  ) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading members...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  /* ------------------------------------------------------------------------ */
  /* No organization                                                          */
  /* ------------------------------------------------------------------------ */

  if (!organization) {
    return (
      <Card>
        <CardContent className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <Users className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              No organization selected
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Select an organization to view its members.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }


  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (membersError) {
    return (
      <Card>
        <CardContent className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-destructive">
              Failed to load members
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {membersErrorData?.response?.data?.message ??
                membersErrorData?.message ??
                "Something went wrong."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }


  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Organization
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Members
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage everyone who has access to{" "}
            <span className="font-medium text-foreground">
              {organization.name}
            </span>
            .
          </p>
        </div>

        <Badge
          variant="outline"
          className="w-fit px-3 py-1.5"
        >
          {members.length}{" "}
          {members.length === 1
            ? "member"
            : "members"}
        </Badge>
      </div>


      {/* ------------------------------------------------------------------ */}
      {/* Summary                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardContent className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {members.length}{" "}
              {members.length === 1
                ? "member"
                : "members"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              People with access to this organization
            </p>
          </div>
        </CardContent>
      </Card>


      {/* ------------------------------------------------------------------ */}
      {/* Members                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Organization members
          </CardTitle>

          <CardDescription>
            Everyone who currently has access to this organization.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No members found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no members in this organization.
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] divide-y overflow-y-auto">
              {members.map((member) => {
                const memberId =
                  getMemberId(member);

                const memberName =
                  getMemberName(member);

                const memberEmail =
                  getMemberEmail(member);

                const memberRole =
                  member?.role ?? "MEMBER";

                const current =
                  isCurrentUser(member);

                const canManage =
                  canManageMember(member);

                return (
                  <div
                    key={memberId}
                    className="flex min-w-0 items-center gap-3 px-5 py-4 sm:gap-4 sm:px-6"
                  >
                    {/* Avatar */}
                    <Avatar className="size-10 shrink-0 sm:size-11">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(
                          memberName
                        )}
                      </AvatarFallback>
                    </Avatar>


                    {/* User */}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {memberName}
                        </p>

                        {current && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </div>

                      {memberEmail && (
                        <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                          {memberEmail}
                        </p>
                      )}
                    </div>


                    {/* Desktop role */}
                    <Badge
                      variant="outline"
                      className="hidden shrink-0 sm:flex"
                    >
                      {memberRole === "OWNER" && (
                        <Crown className="mr-1 size-3" />
                      )}

                      {memberRole === "ADMIN" && (
                        <Shield className="mr-1 size-3" />
                      )}

                      {memberRole}
                    </Badge>


                    {/* Mobile role */}
                    <Badge
                      variant="outline"
                      className="flex shrink-0 sm:hidden"
                    >
                      {memberRole === "OWNER" ? (
                        <Crown className="size-3" />
                      ) : memberRole === "ADMIN" ? (
                        <Shield className="size-3" />
                      ) : (
                        "MEMBER"
                      )}
                    </Badge>


                    {/* Actions */}
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            disabled={
                              updateMemberRoleMutation.isPending ||
                              removeMemberMutation.isPending
                            }
                            aria-label={`Actions for ${memberName}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-56"
                        >

                          {/* ------------------------------------------------ */}
                          {/* OWNER ONLY                                       */}
                          {/* ------------------------------------------------ */}

                          {isOwner && (
                            <>
                              {memberRole === "MEMBER" && (
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();

                                    openRoleDialog(
                                      member,
                                      "ADMIN"
                                    );
                                  }}
                                >
                                  <Crown className="mr-2 size-4" />

                                  Make admin
                                </DropdownMenuItem>
                              )}

                              {memberRole === "ADMIN" && (
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();

                                    openRoleDialog(
                                      member,
                                      "MEMBER"
                                    );
                                  }}
                                >
                                  <UserRound className="mr-2 size-4" />

                                  Make member
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onSelect={(event) => {
                                  event.preventDefault();

                                  openTransferDialog(
                                    member
                                  );
                                }}
                              >
                                <Crown className="mr-2 size-4" />

                                Transfer ownership
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                            </>
                          )}


                          {/* ------------------------------------------------ */}
                          {/* REMOVE                                           */}
                          {/* ------------------------------------------------ */}

                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault();

                              openRemoveDialog(
                                member
                              );
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="mr-2 size-4" />

                            Remove member
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>


      {/* ------------------------------------------------------------------ */}
      {/* Leave organization                                                  */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Leave organization
          </CardTitle>

          <CardDescription>
            Remove yourself from this organization.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isOwner ? (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm font-medium">
                Transfer ownership before leaving
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                As the owner, you must transfer ownership to another member before you can leave this organization.
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              disabled={
                leaveOrganizationMutation.isPending
              }
              onClick={openLeaveDialog}
            >
              Leave organization
            </Button>
          )}
        </CardContent>
      </Card>


      {/* ================================================================== */}
      {/* DIALOGS                                                            */}
      {/* ================================================================== */}


      {/* ------------------------------------------------------------------ */}
      {/* Make admin / make member                                           */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          dialogType === "make-admin" ||
          dialogType === "make-member"
        }
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "make-admin"
                ? "Make member an admin?"
                : "Make admin a member?"}
            </DialogTitle>

            <DialogDescription>
              {dialogType === "make-admin"
                ? `Give ${getMemberName(
                    selectedMember
                  )} admin permissions in this organization.`
                : `Remove admin permissions from ${getMemberName(
                    selectedMember
                  )}. They will remain a member of this organization.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={
                  updateMemberRoleMutation.isPending
                }
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={
                updateMemberRoleMutation.isPending
              }
              onClick={() =>
                handleRoleChange(
                  selectedMember,
                  dialogType === "make-admin"
                    ? "ADMIN"
                    : "MEMBER"
                )
              }
            >
              {updateMemberRoleMutation.isPending
                ? "Updating..."
                : dialogType === "make-admin"
                  ? "Make admin"
                  : "Make member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ------------------------------------------------------------------ */}
      {/* Transfer ownership                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          dialogType === "transfer"
        }
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Transfer ownership?
            </DialogTitle>

            <DialogDescription>
              You are about to transfer ownership of{" "}
              <span className="font-medium text-foreground">
                {organization.name}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {getMemberName(
                  selectedMember
                )}
              </span>
              .

              <br />

              <span className="mt-2 block">
                You will no longer be the owner of this organization.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={
                  updateMemberRoleMutation.isPending
                }
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={
                updateMemberRoleMutation.isPending
              }
              onClick={
                handleTransferOwnership
              }
            >
              {updateMemberRoleMutation.isPending
                ? "Transferring..."
                : "Transfer ownership"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ------------------------------------------------------------------ */}
      {/* Remove member                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          dialogType === "remove"
        }
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Remove member?
            </DialogTitle>

            <DialogDescription>
              Remove{" "}
              <span className="font-medium text-foreground">
                {getMemberName(
                  selectedMember
                )}
              </span>{" "}
              from{" "}
              <span className="font-medium text-foreground">
                {organization.name}
              </span>
              ?

              <br />

              <span className="mt-2 block">
                They will no longer have access to this organization.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={
                  removeMemberMutation.isPending
                }
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              disabled={
                removeMemberMutation.isPending
              }
              onClick={
                handleRemoveMember
              }
            >
              {removeMemberMutation.isPending
                ? "Removing..."
                : "Remove member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ------------------------------------------------------------------ */}
      {/* Leave organization                                                  */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          dialogType === "leave"
        }
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Leave organization?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to leave{" "}
              <span className="font-medium text-foreground">
                {organization.name}
              </span>
              ?

              <br />

              <span className="mt-2 block">
                You will lose access to this organization's projects, APIs, environments, and other resources.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={
                  leaveOrganizationMutation.isPending
                }
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              disabled={
                leaveOrganizationMutation.isPending
              }
              onClick={
                handleLeaveOrganization
              }
            >
              {leaveOrganizationMutation.isPending
                ? "Leaving..."
                : "Leave organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}