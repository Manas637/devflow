import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const PasswordInput = forwardRef(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          tabIndex={-1}
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          className="absolute right-3 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}

          <span className="sr-only">
            {showPassword
              ? "Hide password"
              : "Show password"}
          </span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;