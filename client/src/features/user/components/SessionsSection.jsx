import {
  MonitorSmartphone,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import SessionItem from "./SessionItem";

import useSessions from "@/features/user/hooks/useSessions";
import useRevokeSession from "@/features/user/hooks/useRevokeSession";
import useRevokeOtherSessions from "@/features/user/hooks/useRevokeOtherSessions";

import { useSelector } from "react-redux";
import { selectAccessToken } from "@/store/auth";
import getSessionId from "@/features/auth/utils/getSessionId";

export default function SessionsSection() {
  const accessToken = useSelector(selectAccessToken);
  const currentSessionId = getSessionId(accessToken); 

  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useSessions();

  const revokeMutation = useRevokeSession();
  const revokeOthersMutation = useRevokeOtherSessions();

  const handleRevoke = async (sessionId) => {
    try {
      await revokeMutation.mutateAsync(sessionId);

      toast.success("Session revoked successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to revoke this session."
      );
    }
  };

  const handleRevokeOthers = async () => {
    try {
      await revokeOthersMutation.mutateAsync();

      toast.success(
        "All other sessions have been revoked."
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to revoke other sessions."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load sessions"
        description="We couldn't retrieve your active sessions."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MonitorSmartphone className="size-4" />
            </div>

            <div>
              <h2 className="font-semibold">
                Active sessions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the devices and browsers currently
                signed in to your account.
              </p>
            </div>
          </div>

          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              disabled={revokeOthersMutation.isPending}
              onClick={handleRevokeOthers}
            >
              <LogOut className="mr-2 size-4" />
              Revoke other sessions
            </Button>
          )}
        </div>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={MonitorSmartphone}
          title="No active sessions"
          description="There are currently no active sessions associated with your account."
        />
      ) : (
        <div className="divide-y divide-border/60">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isCurrent={
                session.id === currentSessionId
              }
              onRevoke={handleRevoke}
              isRevoking={
                revokeMutation.isPending
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}