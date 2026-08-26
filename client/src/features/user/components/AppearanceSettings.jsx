import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/cn";

const appearanceOptions = [
  {
    value: "system",
    label: "System",
    description: "Use your system preference.",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    description: "Use the light appearance.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the dark appearance.",
    icon: Moon,
  },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="rounded-xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-6 py-5">
        <h2 className="font-semibold">Preferences</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Customize how DevFlow looks and behaves.
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium">
              Appearance
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose how DevFlow should appear.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Appearance"
            className="grid gap-3 pt-3 sm:grid-cols-3"
          >
            {appearanceOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col items-start rounded-lg border p-4 text-left transition-colors",
                    "hover:bg-muted/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border/60"
                  )}
                >
                  <div
                    className={cn(
                      "mb-3 flex size-9 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <span className="text-sm font-medium">
                    {option.label}
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}