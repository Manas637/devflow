import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] items-center justify-center px-6 py-12",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-5 rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="size-8 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {(onRetry || action) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
              >
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>
            )}

            {action}
          </div>
        )}
      </div>
    </div>
  );
}