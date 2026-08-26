import {
  Building2,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NoOrganizationState() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="size-7 text-primary" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome to DevFlow
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          You're not part of an organization yet.
          Create your own organization to start
          managing projects, APIs, and development
          environments.
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() =>
              navigate("/organization/create")
            }
          >
            <Plus className="mr-2 size-4" />
            Create organization
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          If someone has invited you to an organization,
          check your email for the invitation.
        </p>
      </div>
    </div>
  );
}