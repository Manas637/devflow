import {
  AlertCircle,
  Building2,
  Clock,
  Loader2,
  Shield,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingScreen from "@/components/feedback/LoadingScreen";

import useGetInvitation from "@/features/organization/hooks/useGetInvitation";
import useAcceptInvitation from "@/features/organization/hooks/useAcceptInvitation";
import useAuth from "@/features/auth/hooks/useAuth";
import useLogout from "@/features/auth/hooks/useLogout";

import {
  savePendingInvitation,
  clearPendingInvitation,
} from "@/features/organization/utils/pendingInvitation";

export default function InvitationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const {
    data,
    isLoading: invitationLoading,
    isFetching,
    isError,
  } = useGetInvitation(token, user?.id);

  const acceptMutation = useAcceptInvitation();
  const logoutMutation = useLogout();

  const invitation = data?.data?.data ?? null;

  /*
   * ---------------------------------------------------------------
   * Missing token
   * ---------------------------------------------------------------
   */

  if (!token) {
    return (
      <InvitationError
        title="Invalid invitation"
        message="This invitation link is missing a valid token."
        onBack={() => navigate("/")}
      />
    );
  }

  /*
   * ---------------------------------------------------------------
   * Authentication state is still being restored
   * ---------------------------------------------------------------
   *
   * Do NOT render the invitation actions while we don't know
   * which account is currently authenticated.
   *
   * This prevents:
   *
   * Account A -> logout -> Account B
   *
   * from briefly showing Account A's invitation state.
   */

  if (authLoading) {
    return (
      <LoadingScreen message="Checking your account..." />
    );
  }

  /*
   * ---------------------------------------------------------------
   * Logging out / switching account
   * ---------------------------------------------------------------
   *
   * Completely block the invitation UI during logout.
   */

  if (logoutMutation.isPending) {
    return (
      <LoadingScreen message="Signing you out..." />
    );
  }

  /*
   * ---------------------------------------------------------------
   * Invitation loading
   * ---------------------------------------------------------------
   */

  if (invitationLoading) {
    return (
      <LoadingScreen message="Loading invitation..." />
    );
  }

  /*
   * ---------------------------------------------------------------
   * Invitation error
   * ---------------------------------------------------------------
   */

  if (isError || !invitation) {
    return (
      <InvitationError
        title="Invitation unavailable"
        message="This invitation is invalid, expired, or no longer available."
        onBack={() => navigate("/")}
      />
    );
  }

  /*
   * ---------------------------------------------------------------
   * Authentication
   * ---------------------------------------------------------------
   */

  const handleAuthentication = () => {
    /*
     * Keep the token because the user may:
     *
     * Invitation
     *   -> Login
     *   -> Register
     *   -> Check Email
     *   -> Verify Email
     *   -> Login
     *   -> Invitation
     */

    savePendingInvitation(token);

    const invitationRedirect =
      `/invitations/accept?token=${encodeURIComponent(token)}`;

    navigate(
      `/login?redirect=${encodeURIComponent(
        invitationRedirect
      )}`
    );
  };

  /*
   * ---------------------------------------------------------------
   * Accept invitation
   * ---------------------------------------------------------------
   */

  const handleAccept = () => {
    /*
     * Authentication is required.
     */

    if (!isAuthenticated || !user) {
      handleAuthentication();
      return;
    }

    /*
     * Frontend safety check.
     *
     * Backend is still the actual security boundary.
     */

    if (invitation.canAccept !== true) {
      return;
    }

    acceptMutation.mutate(token, {
      onSuccess: () => {
        /*
         * Invitation has now been consumed.
         *
         * Do NOT invalidate/refetch the public invitation query.
         */

        clearPendingInvitation();

        navigate("/dashboard", {
          replace: true,
        });
      },
    });
  };

  /*
   * ---------------------------------------------------------------
   * Switch account
   * ---------------------------------------------------------------
   */

  const handleSwitchAccount = () => {
    /*
     * Preserve invitation while switching accounts.
     */

    savePendingInvitation(token);

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        /*
         * Go directly to login.
         *
         * InvitationPage is not rendered during logout because
         * logoutMutation.isPending blocks the UI above.
         */

        navigate(
          `/login?redirect=${encodeURIComponent(
            `/invitations/accept?token=${token}`
          )}`,
          {
            replace: true,
          }
        );
      },
    });
  };

  /*
   * ---------------------------------------------------------------
   * UI
   * ---------------------------------------------------------------
   */

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">

          {/* Icon */}

          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="size-7 text-primary" />
          </div>

          {/* Heading */}

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-primary">
              Organization invitation
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              You're invited to join
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              You've been invited to join{" "}
              <span className="font-medium text-foreground">
                {invitation.organization?.name ||
                  "this organization"}
              </span>
              .
            </p>
          </div>

          {/* Details */}

          <div className="mt-8 space-y-3">
            <InvitationDetail
              icon={Building2}
              label="Organization"
              value={
                invitation.organization?.name ||
                "Organization"
              }
            />

            <InvitationDetail
              icon={Shield}
              label="Role"
              value={invitation.role}
            />

            {invitation.expiresAt && (
              <InvitationDetail
                icon={Clock}
                label="Expires"
                value={new Date(
                  invitation.expiresAt
                ).toLocaleDateString()}
              />
            )}
          </div>

          {/* -------------------------------------------------------
              Unauthenticated
             ------------------------------------------------------- */}

          {!isAuthenticated && (
            <div className="mt-8">
              <Button
                className="w-full"
                onClick={handleAuthentication}
              >
                Sign in or create an account
              </Button>
            </div>
          )}

          {/* -------------------------------------------------------
              Logged in with WRONG account
             ------------------------------------------------------- */}

          {isAuthenticated &&
            invitation.canAccept === false && (
              <>
                <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

                    <div>
                      <p className="text-sm font-medium">
                        This invitation is for another account
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        This invitation was sent to a
                        different email address. Sign in
                        with the account that received the
                        invitation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={
                      logoutMutation.isPending
                    }
                    onClick={handleSwitchAccount}
                  >
                    Sign in with another account
                  </Button>
                </div>
              </>
            )}

          {/* -------------------------------------------------------
              Logged in with CORRECT account
             ------------------------------------------------------- */}

          {isAuthenticated &&
            invitation.canAccept === true && (
              <div className="mt-8">
                <Button
                  className="w-full"
                  disabled={
                    acceptMutation.isPending ||
                    isFetching
                  }
                  onClick={handleAccept}
                >
                  {acceptMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Accepting invitation...
                    </>
                  ) : (
                    "Accept invitation"
                  )}
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

/*
 * ------------------------------------------------------------------
 * Invitation Detail
 * ------------------------------------------------------------------
 */

function InvitationDetail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

/*
 * ------------------------------------------------------------------
 * Error
 * ------------------------------------------------------------------
 */

function InvitationError({
  title,
  message,
  onBack,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="size-7 text-destructive" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <Button
          variant="outline"
          className="mt-6"
          onClick={onBack}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}