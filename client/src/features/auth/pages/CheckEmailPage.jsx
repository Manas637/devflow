import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import AuthStatusCard from "../components/AuthStatusCard";

export default function CheckEmailPage() {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <main className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <AuthStatusCard
        icon={Mail}
        title="Check your email"
        description={
          email
            ? `We've sent a verification link to ${email}.`
            : "We've sent a verification link to your email address."
        }
      >
        <div className="space-y-6 pt-2">
          {/* Instructions */}
          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Verify your email to continue
                </p>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Open the email we just sent you and click the
                  verification link. The link will take you back
                  to DevFlow and activate your account.
                </p>
              </div>
            </div>
          </div>

          {/* Resend */}
          <Link
            to={ROUTES.RESEND_VERIFICATION}
            state={{ email }}
            className="block"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full"
            >
              <RefreshCw className="mr-2 size-4" />
              Resend Verification Email
            </Button>
          </Link>

          {/* Login */}
          <Link
            to={ROUTES.LOGIN}
            className="block"
          >
            <Button
              variant="ghost"
              className="h-10 w-full"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Login
            </Button>
          </Link>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Didn't receive the email? Check your spam or junk
            folder.
          </p>
        </div>
      </AuthStatusCard>
    </main>
  );
}