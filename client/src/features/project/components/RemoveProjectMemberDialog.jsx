import {
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const RemoveProjectMemberDialog = ({
  open,
  onOpenChange,
  member,
  onConfirm,
  isPending,
}) => {
  if (!member) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Remove member?
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {member.user?.name ||
                member.user?.email}
            </span>{" "}
            from this project? They will no
            longer have access to it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <AlertTriangle className="size-5 shrink-0 text-destructive" />

          <p className="text-sm text-muted-foreground">
            This action will remove their
            project membership.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? "Removing..."
              : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveProjectMemberDialog;