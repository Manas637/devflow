import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { LogOut } from "lucide-react";

import { useNavigate } from "react-router-dom";

import useLeaveProject from "@/features/project/hooks/useLeaveProject";

const LeaveProjectDialog = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  organizationId
}) => {
  const navigate = useNavigate();

  const leaveMutation =
    useLeaveProject(projectId,organizationId);

  const handleConfirm = () => {
    leaveMutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);

        navigate("/projects");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!leaveMutation.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Leave project?
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to leave{" "}
            <span className="font-medium text-foreground">
              "{projectName}"
            </span>
            ? You will lose access to this project
            unless you are added again.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={
              leaveMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              leaveMutation.isPending
            }
          >
            <LogOut className="mr-2 size-4" />

            {leaveMutation.isPending
              ? "Leaving..."
              : "Leave Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveProjectDialog;