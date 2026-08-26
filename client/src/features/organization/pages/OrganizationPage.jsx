import {
  Building2,
  CalendarDays,
  Shield,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import useCurrentOrganization from "../hooks/useCurrentOrganization";
import useUpdateOrganization from "../hooks/useUpdateOrganization";
import useDeleteOrganization from "../hooks/useDeleteOrganization";

import { ROLE_LABELS } from "@/features/user/constants/roleLabels";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OrganizationPage() {
  const {
    organization,
    isLoading,
    isError,
  } = useCurrentOrganization();

  const updateMutation =
    useUpdateOrganization();

  const deleteMutation =
    useDeleteOrganization();

  const [editOpen, setEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-48 animate-pulse rounded-xl bg-muted" />

        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold">
          Unable to load organization
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          We couldn't load the current organization.
        </p>
      </div>
    );
  }

  const role =
    organization.role;

  const isOwner =
    role === "OWNER";

  const openEditDialog = () => {
    setName(organization.name);
    setEditOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      toast.error(
        "Organization name is required."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        organizationId:
          organization.id,
        data: {
          name: trimmedName,
        },
      });

      toast.success(
        "Organization updated successfully."
      );

      setEditOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update organization."
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(
        organization.id
      );

      toast.success(
        "Organization deleted successfully."
      );

      setDeleteOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to delete organization."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Organization
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {organization.name}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your organization and workspace.
        </p>
      </div>

      {/* Organization information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Organization details
          </CardTitle>

          <CardDescription>
            Basic information about this organization.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Name
                </p>

                <p className="mt-1 truncate text-sm font-medium">
                  {organization.name}
                </p>
              </div>
            </div>

            {/* Slug */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-sm font-semibold">
                  /
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Slug
                </p>

                <p className="mt-1 truncate text-sm font-medium">
                  {organization.slug}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Your role
                </p>

                <p className="mt-1 text-sm font-medium">
                  {ROLE_LABELS[role] ??
                    role}
                </p>
              </div>
            </div>

            {/* Created */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <CalendarDays className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium">
                  {new Date(
                    organization.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
              <Button
                onClick={openEditDialog}
              >
                Edit organization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      {isOwner && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">
              Danger zone
            </CardTitle>

            <CardDescription>
              These actions can permanently affect this organization.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">
                  Delete organization
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Permanently delete this organization and its associated data.
                </p>
              </div>

              <Button
                variant="destructive"
                onClick={() =>
                  setDeleteOpen(true)
                }
              >
                <Trash2 className="mr-2 size-4" />
                Delete organization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>
                Edit organization
              </DialogTitle>

              <DialogDescription>
                Update the name of your organization.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <Label htmlFor="organization-name">
                Organization name
              </Label>

              <Input
                id="organization-name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className="mt-2"
                maxLength={100}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  updateMutation.isPending
                }
              >
                {updateMutation.isPending
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete organization?
            </DialogTitle>

            <DialogDescription>
              This action cannot be undone. The organization and its associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={
                deleteMutation.isPending
              }
              onClick={handleDelete}
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}