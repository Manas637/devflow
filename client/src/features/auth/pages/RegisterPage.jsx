import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import PasswordInput from "@/components/forms/PasswordInput";
import LoadingButton from "@/components/forms/LoadingButton";
import AuthCard from "@/components/auth/AuthCard";

import { registerSchema } from "@/features/auth/validation/auth.schema";

import useRegister from "@/features/auth/hooks/useRegister";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");

  const { mutateAsync, isPending } = useRegister();

  const form = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      const {
        // eslint-disable-next-line no-unused-vars
        confirmPassword,
        ...payload
      } = values;

      await mutateAsync(payload);

      toast.success(
        "Account created. Please check your email to verify your account."
      );

      /*
       * Preserve the redirect through the verification flow.
       *
       * The invitation token itself remains in localStorage.
       */
      navigate(ROUTES.CHECK_EMAIL, {
        replace: true,

        state: {
          email: payload.email,
          redirect,
        },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Registration failed."
      );
    }
  };

  const loginUrl = redirect
    ? `/login?redirect=${encodeURIComponent(
        redirect
      )}`
    : ROUTES.LOGIN;

  return (
    <AuthCard
      title="Create Account"
      description="Start managing your projects today."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Name */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password
                </FormLabel>

                <FormControl>
                  <PasswordInput
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            loading={isPending}
            loadingText="Creating Account..."
            className="w-full"
          >
            Create Account
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to={loginUrl}
          className="font-medium text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
}