import {
  Clock,
  Mail,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import useCurrentOrganization from "../hooks/useCurrentOrganization";
import useGetInvitations from "../hooks/useGetInvitations";
import useCreateInvitation from "../hooks/useCreateInvitation";
import useCancelInvitation from "../hooks/useCanceInvitation";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InvitationsPage() {
  const {
    organization,
    isLoading: organizationLoading,
  } = useCurrentOrganization();

  const {
    data,
    isLoading: invitationsLoading,
  } = useGetInvitations(
    organization?.id
  );

  const createMutation =
    useCreateInvitation();

  const cancelMutation =
    useCancelInvitation();

  const [inviteOpen, setInviteOpen] =
    useState(false);

  const [cancelInvitation, setCancelInvitation] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("MEMBER");

  const invitations =
    data?.data?.data ?? [];

  const isOwner =
    organization?.role === "OWNER";

  const isAdmin =
    organization?.role === "ADMIN";

  const canInvite =
    isOwner || isAdmin;

  if (
    organizationLoading ||
    invitationsLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="h-16 animate-pulse rounded-xl bg-muted" />

        <div className="h-80 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  const pendingInvitations =
    invitations.filter(
      (invitation) =>
        invitation.status ===
        "PENDING"
    );

  const handleCreateInvitation =
    async (event) => {
      event.preventDefault();

      const normalizedEmail =
        email.trim().toLowerCase();

      if (!normalizedEmail) {
        toast.error(
          "Email address is required."
        );
        return;
      }

      try {
        await createMutation.mutateAsync({
          organizationId:
            organization.id,
          data: {
            email: normalizedEmail,
            role,
          },
        });

        toast.success(
          "Invitation sent successfully."
        );

        setEmail("");
        setRole("MEMBER");
        setInviteOpen(false);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
            "Failed to send invitation."
        );
      }
    };

  const handleCancelInvitation =
    async () => {
      if (!cancelInvitation) {
        return;
      }

      try {
        await cancelMutation.mutateAsync({
          organizationId:
            organization.id,
          invitationId:
            cancelInvitation.id,
        });

        toast.success(
          "Invitation cancelled."
        );

        setCancelInvitation(null);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
            "Failed to cancel invitation."
        );
      }
    };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Organization
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Invitations
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Invite people to join{" "}
            <span className="font-medium text-foreground">
              {organization.name}
            </span>
            .
          </p>
        </div>

        {canInvite && (
          <Button
            onClick={() =>
              setInviteOpen(true)
            }
          >
            <Plus className="mr-2 size-4" />
            Invite member
          </Button>
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {pendingInvitations.length}{" "}
              pending{" "}
              {pendingInvitations.length ===
              1
                ? "invitation"
                : "invitations"}
            </p>

            <p className="text-xs text-muted-foreground">
              Invitations waiting for a response
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending invitations
          </CardTitle>

          <CardDescription>
            Invitations that have not yet been accepted or rejected.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {pendingInvitations.length ===
          0 ? (
            <div className="px-6 py-12 text-center">
              <Mail className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No pending invitations
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Invite someone to collaborate with your organization.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {pendingInvitations.map(
                (invitation) => (
                  <div
                    key={invitation.id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Mail className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {invitation.email}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Invited{" "}
                            {formatDate(
                              invitation.createdAt
                            )}
                          </span>

                          {invitation.expiresAt && (
                            <>
                              <span>
                                •
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />

                                Expires{" "}
                                {formatDate(
                                  invitation.expiresAt
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {invitation.role}
                      </Badge>

                      {canInvite && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setCancelInvitation(
                                  invitation
                                )
                              }
                            >
                              <X className="mr-2 size-4" />
                              Cancel invitation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create invitation */}
      <Dialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      >
        <DialogContent>
          <form
            onSubmit={
              handleCreateInvitation
            }
          >
            <DialogHeader>
              <DialogTitle>
                Invite a member
              </DialogTitle>

              <DialogDescription>
                Send an invitation to join{" "}
                {organization.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-6">
              <div>
                <Label htmlFor="invite-email">
                  Email address
                </Label>

                <Input
                  id="invite-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>
                  Role
                </Label>

                <Select
                  value={role}
                  onValueChange={setRole}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="MEMBER">
                      Member
                    </SelectItem>

                    {isOwner && (
                      <SelectItem value="ADMIN">
                        Admin
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <p className="mt-2 text-xs text-muted-foreground">
                  {role === "ADMIN"
                    ? "Admins can manage organization members and invitations."
                    : "Members have access to the organization workspace."}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setInviteOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  createMutation.isPending
                }
              >
                {createMutation.isPending
                  ? "Sending..."
                  : "Send invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel invitation */}
      <Dialog
        open={Boolean(
          cancelInvitation
        )}
        onOpenChange={(open) => {
          if (!open) {
            setCancelInvitation(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cancel invitation?
            </DialogTitle>

            <DialogDescription>
              The invitation sent to{" "}
              <strong>
                {cancelInvitation?.email}
              </strong>{" "}
              will no longer be usable.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setCancelInvitation(null)
              }
            >
              Keep invitation
            </Button>

            <Button
              variant="destructive"
              disabled={
                cancelMutation.isPending
              }
              onClick={
                handleCancelInvitation
              }
            >
              {cancelMutation.isPending
                ? "Cancelling..."
                : "Cancel invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}