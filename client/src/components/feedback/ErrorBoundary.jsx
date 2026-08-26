import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "Unhandled application error:",
      error,
      errorInfo
    );

    // Later:
    // Send this to Sentry / another monitoring service.
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-destructive/10 p-5">
              <AlertTriangle className="size-10 text-destructive" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              An unexpected error occurred. Please try
              again.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button onClick={this.handleRetry}>
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  window.location.assign("/")
                }
              >
                Go to Home
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}