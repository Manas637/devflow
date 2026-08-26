import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LoadingButton from "@/components/forms/LoadingButton";

import useUpdateProfile from "@/features/user/hooks/useUpdateProfile";

import { updateProfileSchema } from "@/features/user/validation/user.schema";
import { ROLE_LABELS } from "@/features/user/constants/roleLabels";

import { selectUser } from "@/store/auth";
import { setUser } from "@/store/auth";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { mutateAsync, isPending } = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),

    defaultValues: {
      name: "",
    },

    mode: "onTouched",
  });

  /*
   * Keep the form synchronized with Redux user.
   *
   * We intentionally only depend on the relevant user fields.
   * This prevents unnecessary resets when the user object reference
   * changes for unrelated reasons.
   */
  useEffect(() => {
    if (!user) return;

    form.reset({
      name: user.name ?? "",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.name, form]);

  /*
   * Normalize values before comparing them.
   *
   * This means:
   * "Manas"
   * " Manas"
   * "Manas "
   *
   * are treated as the same name.
   */
  const normalizeName = (name) => {
    return name?.trim() ?? "";
  };

  const currentName = normalizeName(user?.name);
  // eslint-disable-next-line react-hooks/incompatible-library
  const formName = normalizeName(form.watch("name"));

  const hasChanges = currentName !== formName;

  const onSubmit = async (values) => {
    if (!user) return;

    const normalizedName = normalizeName(values.name);

    /*
     * Never send an unnecessary API request.
     */
    if (normalizedName === currentName) {
      form.reset({
        name: user.name ?? "",
      });

      return;
    }

    try {
      const response = await mutateAsync({
        name: normalizedName,
      });

      /*
       * Depending on your axios/API wrapper, the returned value
       * may be:
       *
       * response.data.data
       * response.data
       * or directly the user.
       *
       * We handle the normal ApiResponse structure first.
       */
      const updatedUser =
        response?.data?.data ??
        response?.data ??
        response;

      if (!updatedUser?.id) {
        throw new Error(
          "Invalid user data returned from update profile."
        );
      }

      /*
       * IMPORTANT:
       * Keep the complete user object in Redux.
       *
       * The sidebar, topbar and profile all depend on selectUser.
       */
      dispatch(setUser(updatedUser));

      /*
       * Reset the form after successful update so that
       * isDirty becomes false and the current value becomes
       * the new baseline.
       */
      form.reset({
        name: updatedUser.name ?? normalizedName,
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to update your profile."
      );
    }
  };

  if (!user) {
    return null;
  }

  const initials =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt)
    : null;

  const formattedMemberSince =
    memberSince && !Number.isNaN(memberSince.getTime())
      ? memberSince.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile summary */}
      <div className="rounded-xl border border-border/60 bg-card">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">
              {user.name}
            </h2>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>

              {user.isEmailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5" />
                  Email verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 px-6 py-5">
          <h2 className="font-semibold">
            Personal information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the information associated with your account.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
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
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={user.email ?? ""}
                  disabled
                  className="pl-9"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed here.
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <FormLabel>Role</FormLabel>

              <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2.5">
                <User className="size-4 text-muted-foreground" />

                <span className="text-sm">
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </div>
            </div>

            {/* Member since */}
            <div className="space-y-2">
              <FormLabel>Member since</FormLabel>

              <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2.5">
                <CalendarDays className="size-4 text-muted-foreground" />

                <span className="text-sm">
                  {formattedMemberSince}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end border-t border-border/60 pt-6">
              <LoadingButton
                type="submit"
                loading={isPending}
                loadingText="Saving..."
                disabled={!hasChanges || isPending}
              >
                Save Changes
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}