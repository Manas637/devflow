import logo from "@/assets/logo.svg";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingScreen({
  message = "Loading...",
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="DevFlow"
          className="h-10 w-10"
        />

        <span className="text-xl font-bold tracking-tight">
          DevFlow
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoadingSpinner />

        <span>{message}</span>
      </div>
    </div>
  );
}