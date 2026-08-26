import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const ProjectConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  isPending,
  destructive = false,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

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
            variant={
              destructive
                ? "destructive"
                : "default"
            }
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? "Please wait..."
              : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectConfirmDialog;