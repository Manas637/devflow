import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FolderKanban,
  Loader2,
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

import useCreateProject from "@/features/project/hooks/useCreateProject";

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(
      100,
      "Project name cannot exceed 100 characters."
    ),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Project description cannot exceed 1000 characters."
  )
    .nullable()
    .optional(),
});

const CreateProjectDialog = ({
  open,
  onOpenChange,
  organizationId,
}) => {
  const createProjectMutation =
    useCreateProject(organizationId);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(
      createProjectSchema
    ),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        description: "",
      });
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (value) => {
    if (
      !value &&
      !createProjectMutation.isPending
    ) {
      reset();
    }

    onOpenChange(value);
  };

  const isPending =
    createProjectMutation.isPending ||
    isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="size-5 text-primary" />
            </div>

            <div>
              <DialogTitle>
                Create project
              </DialogTitle>

              <DialogDescription className="mt-1">
                Create a new project for your
                organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium"
            >
              Project name
            </label>

            <input
              id="project-name"
              {...register("name")}
              placeholder="e.g. DevFlow"
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="project-description"
              className="text-sm font-medium"
            >
              Description
              <span className="ml-1 text-muted-foreground">
                (optional)
              </span>
            </label>

            <textarea
              id="project-description"
              {...register("description")}
              placeholder="What is this project about?"
              rows={4}
              disabled={isPending}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                handleOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;