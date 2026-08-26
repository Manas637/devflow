import { ArrowLeft, House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-10 right-10 size-56 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <section className="mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="text-8xl font-extrabold tracking-tight text-primary/15 sm:text-9xl">
          404
        </p>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-6 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist, may have been moved,
          or the URL might be incorrect.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Check the URL for typing mistakes or head back to the homepage.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>

          <Link to={ROUTES.HOME}>
            <Button>
              <House className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}