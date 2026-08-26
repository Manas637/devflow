import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import useUpdateProjectMemberRole from "@/features/project/hooks/useUpdateProjectMemberRole";

const ROLES = [
  {
    value: "ADMIN",
    label: "Admin",
    description:
      "Can manage project members and project settings.",
  },
  {
    value: "MEMBER",
    label: "Member",
    description:
      "Can collaborate on the project.",
  },
  {
    value: "VIEWER",
    label: "Viewer",
    description:
      "Can view the project but has limited permissions.",
  },
];

const ChangeProjectMemberRoleDialog = ({
  open,
  onOpenChange,
  projectId,
  membership,
}) => {
  const [role, setRole] = useState(
    membership?.role ?? "MEMBER"
  );

  const updateRoleMutation =
    useUpdateProjectMemberRole(
      projectId
    );

  useEffect(() => {
    if (membership?.role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(membership.role);
    }
  }, [membership]);

  const handleSubmit = () => {
    if (!membership) {
      return;
    }

    if (
      membership.role === "OWNER" ||
      role === membership.role
    ) {
      return;
    }

    updateRoleMutation.mutate(
      {
        membershipId: membership.id,
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
      onOpenChange={(value) => {
        if (!updateRoleMutation.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change member role
          </DialogTitle>

          <DialogDescription>
            Change the role for{" "}
            <span className="font-medium text-foreground">
              {membership?.user?.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {ROLES.map((item) => {
            const selected =
              role === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setRole(item.value)
                }
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>

                  <div
                    className={`size-4 rounded-full border ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  />
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={
              updateRoleMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              updateRoleMutation.isPending ||
              !membership ||
              membership.role === "OWNER" ||
              role === membership.role
            }
          >
            {updateRoleMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProjectMemberRoleDialog;