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

import useLogin from "@/features/auth/hooks/useLogin";
import { loginSchema } from "@/features/auth/validation/auth.schema";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");

  const { mutateAsync, isPending } = useLogin();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);

      toast.success("Welcome back!");

      navigate(redirect || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to sign in. Please try again."
      );
    }
  };

  /*
   * Preserve the redirect when the user decides
   * to create an account instead.
   */
  const registerUrl = redirect
    ? `/register?redirect=${encodeURIComponent(
        redirect
      )}`
    : "/register";

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to continue to DevFlow."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    autoComplete="current-password"
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
            loadingText="Signing In..."
            className="w-full"
          >
            Sign In
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to={registerUrl}
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </div>
    </AuthCard>
  );
}