import { useEffect, useState } from "react";

import {
  Search,
  UserPlus,
  Check,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useSearchOrganizationMembers from "@/features/organization/hooks/useSearchOrganizationMembers";
import useAddProjectMember from "@/features/project/hooks/useAddProjectMember";

const AddProjectMemberDialog = ({
  open,
  onOpenChange,
  projectId,
  organizationId,
  existingMembers
}) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [role, setRole] =
    useState("MEMBER");

  const {
    data,
    isLoading: searchLoading,
  } = useSearchOrganizationMembers(
    organizationId,
    search
    );
  
  const existingUserIds = new Set(
    existingMembers.map(
      (member) =>
        member.userId ?? member.user?.id
    )
  );

  const addMemberMutation =
    useAddProjectMember(projectId);

  const members =
  Array.isArray(data)
    ? data
    : data?.data?.data ??
      data?.data ??
      [];

  const availableMembers = members.filter(
    (member) => {
      const userId =
        member.userId ?? member.user?.id;

      return !existingUserIds.has(userId);
    }
  );

  /*
   * Reset dialog state whenever it closes.
   */
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch("");
      setSelectedUser(null);
      setRole("MEMBER");
    }
  }, [open]);

  const handleAddMember = () => {
    if (!selectedUser) {
      return;
    }

    addMemberMutation.mutate(
      {
        userId: selectedUser.userId,
        role,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Project Member
          </DialogTitle>

          <DialogDescription>
            Add a member of your organization to
            this project and assign their project
            role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label>
              Search organization members
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Search results */}
          {search.trim() && (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
              {searchLoading ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Searching members...
                </div>
              ) : members.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  No organization members found.
                </div>
              ) : (
                availableMembers.map((member) => {
                  const user =
                    member.user ?? member;

                  const userId =
                    member.userId ?? user.id;

                  const isSelected =
                    selectedUser?.userId ===
                    userId;

                  return (
                    <button
                      key={userId}
                      type="button"
                      onClick={() => {
                        if (selectedUser?.userId === userId) {
                          setSelectedUser(null);
                        } else {
                          setSelectedUser({
                            userId,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                          });
                        }
                      }}
                      className="flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0 hover:bg-muted/50"
                    >
                      {/* Avatar */}
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "?"}
                        </div>
                      )}

                      {/* User */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="size-4 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Selected user */}
          {selectedUser && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Selected member
              </p>

              <p className="mt-1 text-sm font-medium">
                {selectedUser.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>
          )}

          {/* Role */}
          <div className="space-y-2">
            <Label>
              Project role
            </Label>

            <Select
              value={role}
              onValueChange={setRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ADMIN">
                  Admin
                </SelectItem>

                <SelectItem value="MEMBER">
                  Member
                </SelectItem>

                <SelectItem value="VIEWER">
                  Viewer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={
                addMemberMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleAddMember}
              disabled={
                !selectedUser ||
                addMemberMutation.isPending
              }
            >
              <UserPlus className="mr-2 size-4" />

              {addMemberMutation.isPending
                ? "Adding..."
                : "Add Member"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectMemberDialog;