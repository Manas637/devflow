import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/forms/LoadingButton";
import { ROUTES } from "@/constants/routes";

import AuthStatusCard from "../components/AuthStatusCard";
import useResendVerification from "../hooks/useResendVerification";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  resendVerificationSchema,
} from "../validation/auth.schema";

export default function ResendVerificationPage() {
  const location = useLocation();

  const emailFromState =
    location.state?.email ?? "";

  const form = useForm({
    resolver: zodResolver(
      resendVerificationSchema
    ),
    defaultValues: {
      email: emailFromState,
    },
    mode: "onTouched",
  });

  const {
    mutate,
    isPending,
    isSuccess,
  } = useResendVerification();

  const handleSubmit = (values) => {
    mutate({
      email: values.email,
    });
  };

  if (isSuccess) {
    return (
      <AuthStatusCard
        icon={CheckCircle2}
        title="Check your inbox"
        description="If an unverified account exists for this email, we've sent a new verification link."
      >
        <Link
          to={ROUTES.LOGIN}
          className="block"
        >
          <Button
            className="w-full"
            size="lg"
          >
            Go to Login
          </Button>
        </Link>
      </AuthStatusCard>
    );
  }

  return (
    <AuthStatusCard
      icon={Mail}
      title="Resend verification email"
      description="Enter your email address and we'll send you a new verification link."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            handleSubmit
          )}
          noValidate
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email address
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Sending..."
          >
            Send Verification Email
          </LoadingButton>

          <Link
            to={ROUTES.LOGIN}
            className="block"
          >
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              Back to Login
            </Button>
          </Link>
        </form>
      </Form>
    </AuthStatusCard>
  );
}