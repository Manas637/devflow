import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";

const LoadingButton = forwardRef(
  (
    {
      children,
      loading = false,
      disabled = false,
      loadingText,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size="sm"
            className="mr-2"
          />
        )}

        {loading && loadingText
          ? loadingText
          : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;