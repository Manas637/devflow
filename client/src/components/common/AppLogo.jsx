import { Link } from "react-router-dom";

import logo from "@/assets/logo.svg";

import { cn } from "@/lib/cn";

export default function AppLogo({
  showText = true,
  className,
}) {
  return (
    <Link
      to="/"
      aria-label="DevFlow home"
      className={cn(
        "flex min-w-0 items-center gap-2.5",
        "group-data-[collapsible=icon]:justify-center",
        className
      )}
    >
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0"
      />

      {showText && (
        <span
          className={cn(
            "truncate text-xl font-bold tracking-tight",
            "group-data-[collapsible=icon]:hidden"
          )}
        >
          DevFlow
        </span>
      )}
    </Link>
  );
}