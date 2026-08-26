import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/forms/LoadingButton";

import { ROUTES } from "@/constants/routes";

import AuthStatusCard from "../components/AuthStatusCard";
import useForgotPassword from "../hooks/useForgotPassword";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  forgotPasswordSchema,
} from "../validation/auth.schema";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] =
    useState(false);

  const form = useForm({
    resolver: zodResolver(
      forgotPasswordSchema
    ),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useForgotPassword();

  const handleSubmit = (values) => {
    mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  if (submitted) {
    return (
      <AuthStatusCard
        icon={CheckCircle2}
        title="Check your email"
        description="If an account exists with that email address, we've sent instructions to reset your password."
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  Reset link sent
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Check your inbox and spam folder.
                  The reset link will allow you to
                  choose a new password.
                </p>
              </div>
            </div>
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="block"
          >
            <Button
              size="lg"
              className="w-full"
            >
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthStatusCard>
    );
  }

  return (
    <AuthStatusCard
      icon={Mail}
      title="Forgot your password?"
      description="Enter your email address and we'll send you a link to reset your password."
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

          {isError && (
            <p
              className="text-sm text-destructive"
              role="alert"
            >
              {error?.response?.data?.message ??
                "Unable to process your request. Please try again."}
            </p>
          )}

          <LoadingButton
            type="submit"
            size="lg"
            className="h-11 w-full"
            loading={isPending}
            loadingText="Sending reset link..."
          >
            Send Reset Link
          </LoadingButton>

          <Link
            to={ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </form>
      </Form>
    </AuthStatusCard>
  );
}