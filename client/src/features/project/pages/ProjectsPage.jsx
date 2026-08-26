import {
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";

import ProjectCard from "@/features/project/components/ProjectCard";

import useGetProjectsByOrganization from "@/features/project/hooks/useGetProjectsByOrganization";
import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";
import CreateProjectDialog from "@/features/project/components/CreateProjectDialog";

const ProjectsPage = () => {
  const [createOpen, setCreateOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const currentOrganization =
    useCurrentOrganization();

  const currentOrganizationId =
    currentOrganization.organizationId;

  const organizationRole =
    currentOrganization.organization?.role;

  const canCreateProject =
    organizationRole === "OWNER" ||
    organizationRole === "ADMIN";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProjectsByOrganization(
    currentOrganizationId
  );

  const projects =
    data?.data?.data ??
    data?.data ??
    data ??
    [];

  /*
   * Filter projects by search
   * and status.
   */
  const filteredProjects =
    projects.filter((project) => {
      const query = search
        .trim()
        .toLowerCase();

      /*
       * Search filter
       */
      const matchesSearch =
        !query ||
        project.name
          ?.toLowerCase()
          .includes(query) ||
        project.slug
          ?.toLowerCase()
          .includes(query) ||
        project.description
          ?.toLowerCase()
          .includes(query);

      /*
       * Status filter
       */
      const matchesStatus =
        statusFilter === "ALL" ||
        project.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  /*
   * No organization selected
   */
  if (!currentOrganizationId) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No organization selected"
        description="Select an organization to view its projects."
      />
    );
  }

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-xl border border-border bg-muted/40"
              />
            )
          )}
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (isError) {
    return (
      <ErrorState
        title="Unable to load projects"
        description="We couldn't load the projects for this organization. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and collaborate on your organization's projects.
          </p>
        </div>

        {canCreateProject && (
          <Button
            onClick={() =>
              setCreateOpen(true)
            }
          >
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search projects..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
        >
          <option value="ALL">
            All Projects
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="ARCHIVED">
            Archived
          </option>
        </select>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        /*
         * Organization has no projects at all.
         */
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description={
            canCreateProject
              ? "Create your first project to start organizing your team's work."
              : "You don't have access to any projects yet."
          }
          action={
            canCreateProject ? (
              <Button
                onClick={() =>
                  setCreateOpen(true)
                }
              >
                <Plus className="mr-2 size-4" />
                Create Project
              </Button>
            ) : null
          }
        />
      ) : filteredProjects.length === 0 ? (
        /*
         * Projects exist, but nothing
         * matches the current filters.
         */
        <EmptyState
          icon={Search}
          title="No projects found"
          description={
            search.trim()
              ? `No projects match "${search}".`
              : `There are no ${
                  statusFilter === "ARCHIVED"
                    ? "archived"
                    : "active"
                } projects.`
          }
        />
      ) : (
        /*
         * Filtered projects
         */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
                organizationId={
                  currentOrganizationId
                }
              />
            )
          )}
        </div>
      )}

      {/* Create Project */}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        organizationId={
          currentOrganizationId
        }
      />
    </div>
  );
};

export default ProjectsPage;