import React from "react";
import ReactDOM from "react-dom/client";

import "@/index.css";

import App from "@/app/App";
import Providers from "@/app/providers";
import { store } from "@/store/store";
import { setupInterceptors } from "@/api/setupInterceptors";
import ErrorBoundary from "./components/feedback/ErrorBoundary";

setupInterceptors(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Providers>
      <App />
    </Providers>
  </ErrorBoundary>
);