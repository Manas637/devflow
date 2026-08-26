import {
  MoreHorizontal,
  UserPlus,
  Shield,
  User,
  Trash2,
  Crown,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";

import useGetProjectMembers from "@/features/project/hooks/useGetProjectMembers";
import useGetMyProjectMembership from "@/features/project/hooks/useGetMyProjectMembership";
import useRemoveProjectMember from "@/features/project/hooks/useRemoveProjectMember";

import ChangeProjectMemberRoleDialog from "./ChangeProjectMemberRoleDialog";
import RemoveProjectMemberDialog from "./RemoveProjectMemberDialog";

import AddProjectMemberDialog from "./AddProjectMemberDialog";
import LeaveProjectDialog from "./LeaveProjectDialog";

const ProjectMembers = ({ projectId, organizationId, projectName }) => {
  const [
    roleDialogOpen,
    setRoleDialogOpen,
  ] = useState(false);

  const [
    selectedMembership,
    setSelectedMembership,
  ] = useState(null);

  const [
    removeDialogOpen,
    setRemoveDialogOpen,
  ] = useState(false);

  const [
    addMemberDialogOpen,
    setAddMemberDialogOpen,
  ] = useState(false);

  const [
    leaveDialogOpen,
    setLeaveDialogOpen,
  ] = useState(false);

  const {
    data: membersData,
    isLoading: membersLoading,
    isError: membersError,
    refetch: refetchMembers,
  } = useGetProjectMembers(projectId);

  const {
    data: myMembership,
    isLoading: membershipLoading,
  } = useGetMyProjectMembership(projectId);

  const removeMemberMutation =
    useRemoveProjectMember(projectId);

  const members =
    membersData?.data?.data ??
    membersData?.data ??
    membersData ??
    [];

  const currentRole =
    myMembership?.role;

  const canManageMembers =
    currentRole === "OWNER" ||
    currentRole === "ADMIN";

  /*
   * Loading
   */
  if (
    membersLoading ||
    membershipLoading
  ) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-lg border border-border p-4"
          >
            <div className="size-10 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  /*
   * Error
   */
  if (membersError) {
    return (
      <ErrorState
        title="Unable to load members"
        description="We couldn't load the members of this project. Please try again."
        onRetry={refetchMembers}
        className="min-h-[220px]"
      />
    );
  }

  /*
   * Empty
   */
  if (members.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No project members"
        description="There are currently no members in this project."
        className="min-h-[220px]"
        action={
          canManageMembers ? (
            <Button onClick={()=>setAddMemberDialogOpen(true)}>
              <UserPlus className="mr-2 size-4" />
              Add Member
            </Button>
          ) : null
        }
      />
    );
  }

  /*
   * Remove member
   */
  const handleRemoveClick = (
    membership
  ) => {
    setSelectedMembership(
      membership
    );

    setRemoveDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (!selectedMembership) {
      return;
    }

    removeMemberMutation.mutate(
      selectedMembership.id,
      {
        onSuccess: () => {
          setRemoveDialogOpen(false);
          setSelectedMembership(null);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {members.length}{" "}
            {members.length === 1
              ? "member"
              : "members"}
          </p>
        </div>

        <div className="flex items-center gap-2">
            {canManageMembers && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setAddMemberDialogOpen(true)
                }
              >
                <UserPlus className="mr-2 size-4" />
                Add Member
              </Button>
            )}

            {/* Owner cannot leave the project */}
            {currentRole &&
              currentRole !== "OWNER" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    setLeaveDialogOpen(true)
                  }
                >
                  <LogOut className="mr-2 size-4" />
                  Leave
                </Button>
              )}
          </div>
      </div>

      {/* Members */}
      <div className="divide-y divide-border rounded-xl border border-border">
        {members.map((membership) => {
          const user =
            membership.user;

          const isOwner =
            membership.role === "OWNER";

          return (
            <div
              key={membership.id}
              className="flex items-center gap-4 p-4"
            >
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.name
                    ?.charAt(0)
                    ?.toUpperCase() || "?"}
                </div>
              )}

              {/* User information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user.name}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>

              {/* Role */}
              <div className="hidden items-center gap-2 sm:flex">
                {isOwner ? (
                  <Crown className="size-3.5 text-primary" />
                ) : (
                  <Shield className="size-3.5 text-muted-foreground" />
                )}

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    isOwner
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {membership.role}
                </span>
              </div>

              {/* Actions */}
              {canManageMembers &&
                !isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                      >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">
                          Member actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-44"
                    >
                      {/* Change role */}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMembership(
                            membership
                          );

                          setRoleDialogOpen(
                            true
                          );
                        }}
                      >
                        <Shield />
                        Change Role
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Remove */}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          handleRemoveClick(
                            membership
                          )
                        }
                      >
                        <Trash2 />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          );
        })}
      </div>

      {/* Change role dialog */}
      <ChangeProjectMemberRoleDialog
        open={roleDialogOpen}
        onOpenChange={(open) => {
          setRoleDialogOpen(open);

          if (!open) {
            setSelectedMembership(null);
          }
        }}
        projectId={projectId}
        membership={selectedMembership}
      />

      {/* Remove member dialog */}
      <RemoveProjectMemberDialog
        open={removeDialogOpen}
        onOpenChange={(open) => {
          setRemoveDialogOpen(open);

          if (!open) {
            setSelectedMembership(null);
          }
        }}
        member={selectedMembership}
        onConfirm={handleRemoveConfirm}
        isPending={
          removeMemberMutation.isPending
        }
      />
      <AddProjectMemberDialog
        open={addMemberDialogOpen}
        onOpenChange={setAddMemberDialogOpen}
        projectId={projectId}
        organizationId={
          organizationId
        }
        existingMembers={members}
      />

      <LeaveProjectDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        projectId={projectId}
        projectName={
          projectName
        }
        organizationId={organizationId}
      />
    </div>
  );
};

export default ProjectMembers;