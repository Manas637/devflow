import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  FolderKanban,
  ArrowUpRight,
  ExternalLink,
  Pencil,
  Archive,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useArchiveProject from "@/features/project/hooks/useArchiveProject";
import useActivateProject from "@/features/project/hooks/useActivateProject";
import useDeleteProject from "@/features/project/hooks/useDeleteProject";

import ProjectConfirmDialog from "./ProjectConfirmDialog";
import EditProjectDialog from "./EditProjectDialog";

const ProjectCard = ({
  project,
  organizationId,
}) => {
  const navigate = useNavigate();

  const [confirmAction, setConfirmAction] =
    useState(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const isArchived =
    project.status === "ARCHIVED";

  const archiveMutation =
    useArchiveProject(
      project.id,
      organizationId
    );

  const activateMutation =
    useActivateProject(
      project.id,
      organizationId
    );

  const deleteMutation =
    useDeleteProject(
      project.id,
      organizationId
    );

  const handleOpenProject = () => {
    navigate(
      `/projects/${project.id}`
    );
  };

  const handleArchiveConfirm = () => {
    archiveMutation.mutate(
      undefined,
      {
        onSuccess: () => {
          setConfirmAction(null);
        },
      }
    );
  };

  const handleActivateConfirm = () => {
    activateMutation.mutate(
      undefined,
      {
        onSuccess: () => {
          setConfirmAction(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(
      undefined,
      {
        onSuccess: () => {
          setConfirmAction(null);
        },
      }
    );
  };

  return (
    <>
      <div
        onClick={handleOpenProject}
        className="group relative cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban
                size={20}
                className="text-primary"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold">
                {project.name}
              </h3>

              <p className="truncate text-sm text-muted-foreground">
                {project.slug}
              </p>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal size={18} />

                <span className="sr-only">
                  Project actions
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44"
            >
              {/* Open */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenProject();
                }}
              >
                <ExternalLink />
                Open Project
              </DropdownMenuItem>

              {/* Edit */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                }}
              >
                <Pencil />
                Edit Project
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Archive / Activate */}
              {isArchived ? (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();

                    setConfirmAction(
                      "activate"
                    );
                  }}
                >
                  <RotateCcw />
                  Activate Project
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();

                    setConfirmAction(
                      "archive"
                    );
                  }}
                >
                  <Archive />
                  Archive Project
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Delete */}
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();

                  setConfirmAction(
                    "delete"
                  );
                }}
              >
                <Trash2 />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {project.description ||
            "No project description provided."}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isArchived
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {project.status}
            </span>
          </div>

          <ArrowUpRight
            size={17}
            className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* Archive Confirmation */}
      <ProjectConfirmDialog
        open={
          confirmAction === "archive"
        }
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
        title="Archive project?"
        description={`Are you sure you want to archive "${project.name}"? You can activate it again later.`}
        confirmText="Archive Project"
        onConfirm={
          handleArchiveConfirm
        }
        isPending={
          archiveMutation.isPending
        }
      />

      {/* Activate Confirmation */}
      <ProjectConfirmDialog
        open={
          confirmAction === "activate"
        }
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
        title="Activate project?"
        description={`Are you sure you want to activate "${project.name}"?`}
        confirmText="Activate Project"
        onConfirm={
          handleActivateConfirm
        }
        isPending={
          activateMutation.isPending
        }
      />

      {/* Delete Confirmation */}
      <ProjectConfirmDialog
        open={
          confirmAction === "delete"
        }
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null);
          }
        }}
        title="Delete project?"
        description={`Are you sure you want to permanently delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        destructive
        onConfirm={
          handleDeleteConfirm
        }
        isPending={
          deleteMutation.isPending
        }
      />

      {/* Edit */}
      <EditProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
        organizationId={organizationId}
      />
    </>
  );
};

export default ProjectCard;