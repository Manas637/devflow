import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
};

export default function LoadingSpinner({
  size = "md",
  className,
}) {
  return (
    <LoaderCircle
      className={cn(
        "animate-spin",
        sizes[size],
        className
      )}
    />
  );
}