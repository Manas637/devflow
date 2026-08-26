import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { store } from "@/store/store";
import { queryClient } from "@/lib/react-query";

import ThemeProvider from "@/components/providers/ThemeProvider";
import AuthInitializer from "@/features/auth/AuthInitializer";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthInitializer>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthInitializer>

          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={3000}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}