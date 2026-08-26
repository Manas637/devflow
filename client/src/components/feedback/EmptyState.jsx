import { cn } from "@/lib/cn";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-5 rounded-full bg-primary/10 p-4 text-primary">
          <Icon className="size-8" />
        </div>
      )}

      <h2 className="text-xl font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}