import {
  ArrowLeft,
  Archive,
  CalendarDays,
  FolderKanban,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ErrorState from "@/components/feedback/ErrorState";

import useGetProject from "@/features/project/hooks/useGetProject";
import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";

import useArchiveProject from "@/features/project/hooks/useArchiveProject";
import useActivateProject from "@/features/project/hooks/useActivateProject";
import useDeleteProject from "@/features/project/hooks/useDeleteProject";

import ProjectConfirmDialog from "@/features/project/components/ProjectConfirmDialog";
import EditProjectDialog from "@/features/project/components/EditProjectDialog";
import ProjectMembers from "@/features/project/components/ProjectMembers";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [confirmAction, setConfirmAction] =
    useState(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const currentOrganization =
    useCurrentOrganization();

  const organizationId =
    currentOrganization.organizationId;

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useGetProject(projectId);

  const archiveMutation =
    useArchiveProject(
      projectId,
      organizationId
    );

  const activateMutation =
    useActivateProject(
      projectId,
      organizationId
    );

  const deleteMutation =
    useDeleteProject(
      projectId,
      organizationId
    );

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-muted" />

          <div className="mt-6 h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/40" />
      </div>
    );
  }

  /*
   * Error
   */
  if (isError || !project) {
    return (
      <ErrorState
        title="Unable to load project"
        description="We couldn't load this project. Please try again."
        onRetry={refetch}
        action={
          <Button
            variant="outline"
            onClick={() =>
              navigate("/projects")
            }
          >
            Back to Projects
          </Button>
        }
      />
    );
  }

  const isArchived =
    project.status === "ARCHIVED";

  /*
   * Archive
   */
  const handleArchive = () => {
    archiveMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmAction(null);
      },
    });
  };

  /*
   * Activate
   */
  const handleActivate = () => {
    activateMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmAction(null);
      },
    });
  };

  /*
   * Delete
   */
  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmAction(null);
        navigate("/projects");
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Project information */}
              <div className="flex min-w-0 gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FolderKanban className="size-6 text-primary" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {project.name}
                  </h1>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.slug}
                  </p>

                  <div className="mt-4">
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
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setEditOpen(true)
                  }
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>

                {isArchived ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmAction("activate")
                    }
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Activate
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmAction("archive")
                    }
                  >
                    <Archive className="mr-2 size-4" />
                    Archive
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() =>
                    setConfirmAction("delete")
                  }
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-border px-6 py-5">
            <h2 className="text-sm font-medium">
              Description
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {project.description ||
                "No project description provided."}
            </p>
          </div>
        </div>

        {/* Project Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium">
                  {project.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <FolderKanban className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium">
                  {project.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Members */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Project Members
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage members who have access to this
            project.
          </p>

          <div className="mt-6">
            <ProjectMembers projectId={projectId} organizationId={organizationId} projectName={project.name} />
          </div>
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
        onConfirm={handleArchive}
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
        onConfirm={handleActivate}
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
        onConfirm={handleDelete}
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

export default ProjectDetailPage;