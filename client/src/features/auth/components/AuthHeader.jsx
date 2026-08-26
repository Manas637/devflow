import { Loader2 } from "lucide-react"

export default function AuthHeader({
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="space-y-5 text-center">
      {Icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon
            className={`h-8 w-8 ${
                Icon === Loader2 ? "animate-spin" : ""
            }`}
            />
        </div>
        )}

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}