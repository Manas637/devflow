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

import useUpdateProject from "@/features/project/hooks/useUpdateProject";

const EditProjectDialog = ({
  open,
  onOpenChange,
  project,
  organizationId,
}) => {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const updateMutation =
    useUpdateProject(
      project?.id,
      organizationId
    );

  useEffect(() => {
    if (!project) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(project.name ?? "");
    setDescription(
      project.description ?? ""
    );
  }, [project, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    updateMutation.mutate(
      {
        name: trimmedName,
        description:
          description.trim() || null,
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
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Edit Project
            </DialogTitle>

            <DialogDescription>
              Update your project's name
              and description.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="project-name"
                className="text-sm font-medium"
              >
                Project name
              </label>

              <input
                id="project-name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                maxLength={100}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                placeholder="Project name"
                disabled={
                  updateMutation.isPending
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="project-description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                maxLength={1000}
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                placeholder="Describe your project..."
                disabled={
                  updateMutation.isPending
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={
                updateMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateMutation.isPending ||
                !name.trim()
              }
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;