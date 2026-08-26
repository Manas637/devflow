import { useEffect } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

import AuthStatusCard from "../components/AuthStatusCard";
import useVerifyEmail from "../hooks/useVerifyEmail";

import {
  getPendingInvitation,
} from "@/features/organization/utils/pendingInvitation";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    data,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifyEmail(token);

  /*
   * Build the login URL while preserving
   * the pending invitation.
   */
  const getLoginUrl = () => {
    const invitationToken =
      getPendingInvitation();

    if (!invitationToken) {
      return ROUTES.LOGIN;
    }

    const invitationRedirect =
      `/invitations/accept?token=${encodeURIComponent(
        invitationToken
      )}`;

    return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(
      invitationRedirect
    )}`;
  };

  /*
   * Redirect after successful verification.
   */
  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      navigate(getLoginUrl(), {
        replace: true,
        state: {
          message:
            "Email verified successfully. You can now log in.",
        },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  /*
   * Missing token
   */
  if (!token) {
    return (
      <main
        className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        aria-live="polite"
      >
        <AuthStatusCard
          icon={CircleAlert}
          title="Invalid verification link"
          description="This verification link is missing or malformed."
        >
          <div className="pt-2">
            <Link
              to={ROUTES.LOGIN}
              className="block"
            >
              <Button
                className="h-11 w-full"
                size="lg"
              >
                Go to Login
              </Button>
            </Link>
          </div>
        </AuthStatusCard>
      </main>
    );
  }

  /*
   * Verifying
   */
  if (isPending) {
    return (
      <main
        className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        aria-live="polite"
      >
        <AuthStatusCard
          icon={Loader2}
          title="Verifying your email"
          description="Please wait while we verify your email address."
        >
          <div className="flex items-center justify-center gap-2 pt-3 text-sm text-muted-foreground">
            <Loader2
              className="size-4 animate-spin"
              aria-hidden="true"
            />

            <span>
              Securing your account...
            </span>
          </div>
        </AuthStatusCard>
      </main>
    );
  }

  /*
   * Successfully verified
   */
  if (isSuccess) {
    return (
      <main
        className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        aria-live="polite"
      >
        <AuthStatusCard
          icon={CheckCircle2}
          title="Email verified!"
          description={
            data?.message ??
            "Your email has been successfully verified."
          }
        >
          <div className="space-y-4 pt-2">
            <Button
              className="h-11 w-full"
              size="lg"
              onClick={() => {
                navigate(getLoginUrl(), {
                  replace: true,
                  state: {
                    message:
                      "Email verified successfully. You can now log in.",
                  },
                });
              }}
            >
              Continue to Login
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Redirecting you to login...
            </p>
          </div>
        </AuthStatusCard>
      </main>
    );
  }

  /*
   * Verification failed
   */
  if (isError) {
    const status =
      error?.response?.status;

    let title = "Verification failed";

    let description =
      "We couldn't verify your email address.";

    let icon = XCircle;

    if (status === 400) {
      description =
        error?.response?.data?.message ??
        "This verification link is invalid or has expired.";
    }

    if (status === 409) {
      title = "Email already verified";

      description =
        error?.response?.data?.message ??
        "This email address has already been verified.";

      icon = CheckCircle2;
    }

    if (status >= 500) {
      title = "Something went wrong";

      description =
        "We couldn't verify your email right now. Please try again later.";

      icon = TriangleAlert;
    }

    return (
      <main
        className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        aria-live="polite"
      >
        <AuthStatusCard
          icon={icon}
          title={title}
          description={description}
        >
          <div className="space-y-3 pt-2">
            <Link
              to={getLoginUrl()}
              className="block"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full"
              >
                Go to Login
              </Button>
            </Link>

            <Link
              to={ROUTES.RESEND_VERIFICATION}
              className="block"
            >
              <Button
                size="lg"
                className="h-11 w-full"
              >
                Resend Verification Email
              </Button>
            </Link>
          </div>
        </AuthStatusCard>
      </main>
    );
  }

  return null;
}