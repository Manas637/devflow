import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import LoadingButton from "@/components/forms/LoadingButton";
import PasswordInput from "@/components/forms/PasswordInput";

import useChangePassword from "@/features/user/hooks/useChangePassword";
import { changePasswordSchema } from "@/features/user/validation/user.schema";

export default function ChangePasswordForm() {
  const { mutateAsync, isPending } = useChangePassword();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast.success(
        "Password changed successfully. Other sessions have been signed out."
      );

      form.reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to change your password."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6"
      >
        {/* Current password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>

              <FormControl>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                  <PasswordInput
                    {...field}
                    autoComplete="current-password"
                    placeholder="Enter your current password"
                    disabled={isPending}
                    className="pl-9"
                  />
                </div>
              </FormControl>

              <FormMessage name="currentPassword" />
            </FormItem>
          )}
        />

        {/* New password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>

              <FormControl>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    disabled={isPending}
                    className="pl-9"
                  />
                </div>
              </FormControl>

              <FormMessage name="newPassword" />
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters and include at least
                one uppercase letter, one lowercase letter, one
                number, and one special character.
              </p>
            </FormItem>
          )}
        />

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>

              <FormControl>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    disabled={isPending}
                    className="pl-9"
                  />
                </div>
              </FormControl>

              <FormMessage name="confirmPassword" />
            </FormItem>
          )}
        />

        {/* Warning */}
        <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Changing your password will sign you out of all
            other devices and browsers. Your current session
            will remain active.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end border-t border-border/60 pt-6">
          <LoadingButton
            type="submit"
            loading={isPending}
            loadingText="Changing password..."
            disabled={
              isPending || !form.formState.isDirty || !form.formState.isValid
            }
          >
            Change Password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}