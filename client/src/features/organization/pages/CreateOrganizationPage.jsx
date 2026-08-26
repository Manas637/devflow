import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import LoadingButton from "@/components/forms/LoadingButton";
import AuthCard from "@/components/auth/AuthCard";

import useCreateOrganization from "../hooks/useCreateOrganization";
import {
  createOrganizationSchema,
} from "../validation/organization.schema";
import { Button } from "@/components/ui/button";

export default function CreateOrganizationPage() {
  const navigate = useNavigate();

  const { mutateAsync, isPending } =
    useCreateOrganization();

  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      const response = await mutateAsync(values);

      /*
       * Adjust this depending on whether your axios
       * API function unwraps the response.
       */
      const organization =
        response?.data?.data ?? response?.data;

      if (!organization?.id) {
        throw new Error(
          "Organization was created but its ID was not returned."
        );
      }

      toast.success(
        "Organization created successfully."
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to create organization."
      );
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthCard
          title="Create organization"
          description="Create an organization to start managing your projects and team."
        >
          <div className="mb-6 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="size-7 text-primary" />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Acme Inc."
                        autoComplete="organization"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <LoadingButton
                    type="submit"
                    loading={isPending}
                    loadingText="Creating organization..."
                    className="w-full"
                >
                    Create organization
                </LoadingButton>

                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
                </div>
            </form>
          </Form>
        </AuthCard>
      </div>
    </main>
  );
}