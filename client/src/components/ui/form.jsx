import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/*                                    Form                                    */
/* -------------------------------------------------------------------------- */

export const Form = FormProvider;

/* -------------------------------------------------------------------------- */
/*                                 FormField                                  */
/* -------------------------------------------------------------------------- */

export function FormField(props) {
  return <Controller {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                  FormItem                                  */
/* -------------------------------------------------------------------------- */

export function FormItem({
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "space-y-2",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 FormLabel                                  */
/* -------------------------------------------------------------------------- */

export function FormLabel({
  className,
  children,
  ...props
}) {
  return (
    <Label
      className={className}
      {...props}
    >
      {children}
    </Label>
  );
}

/* -------------------------------------------------------------------------- */
/*                                FormControl                                 */
/* -------------------------------------------------------------------------- */

export function FormControl({
  children,
}) {
  return children;
}

/* -------------------------------------------------------------------------- */
/*                               FormDescription                              */
/* -------------------------------------------------------------------------- */

export function FormDescription({
  className,
  children,
}) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                                FormMessage                                 */
/* -------------------------------------------------------------------------- */

export function FormMessage({
  className,
  name,
}) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  if (!error) return null;

  return (
    <p
      className={cn(
        "text-sm font-medium text-destructive",
        className
      )}
    >
      {error.message}
    </p>
  );
}