import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/forms/LoadingButton";
import PasswordInput from "@/components/forms/PasswordInput";

import { ROUTES } from "@/constants/routes";

import AuthStatusCard from "../components/AuthStatusCard";
import useResetPassword from "../hooks/useResetPassword";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  resetPasswordSchema,
} from "../validation/auth.schema";

export default function ResetPasswordPage() {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [submitted, setSubmitted] =
    useState(false);

  const form = useForm({
    resolver: zodResolver(
      resetPasswordSchema
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useResetPassword();

  const handleSubmit = (values) => {
    if (!token) {
      return;
    }

    mutate(
      {
        token,
        password: values.password,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  /*
   * Missing token
   */
  if (!token) {
    return (
      <AuthStatusCard
        icon={KeyRound}
        title="Invalid reset link"
        description="This password reset link is missing or malformed."
      >
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="block"
        >
          <Button
            size="lg"
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </Link>
      </AuthStatusCard>
    );
  }

  /*
   * Password successfully reset
   */
  if (submitted) {
    return (
      <AuthStatusCard
        icon={CheckCircle2}
        title="Password reset successfully"
        description="Your password has been updated. You can now sign in using your new password."
      >
        <Link
          to={ROUTES.LOGIN}
          className="block"
        >
          <Button
            size="lg"
            className="w-full"
          >
            Continue to Login
          </Button>
        </Link>
      </AuthStatusCard>
    );
  }

  return (
    <AuthStatusCard
      icon={KeyRound}
      title="Create a new password"
      description="Choose a strong password for your account."
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New password
                </FormLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage name="password" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm password
                </FormLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage
                  name="confirmPassword"
                />
              </FormItem>
            )}
          />

          {isError && (
            <p
              className="text-sm text-destructive"
              role="alert"
            >
              {error?.response?.data?.message ??
                "Unable to reset your password. The link may be invalid or expired."}
            </p>
          )}

          <LoadingButton
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText="Resetting password..."
          >
            Reset Password
          </LoadingButton>

          <Link
            to={ROUTES.LOGIN}
            className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to Login
          </Link>
        </form>
      </Form>
    </AuthStatusCard>
  );
}