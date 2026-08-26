import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

import LandingPage from "@/pages/Landing/LandingPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ResendVerificationPage from "@/features/auth/pages/ResendVerificationPage";
import CheckEmailPage from "@/features/auth/pages/CheckEmailPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import NotFound from "@/pages/NotFound";

import ProfilePage from "@/features/user/pages/ProfilePage";
import SettingsPage from "@/pages/Settings/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      /*
       * ----------------------------------------------------------------------
       * Public website
       * ----------------------------------------------------------------------
       */

      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
        ],
      },

      /*
       * ----------------------------------------------------------------------
       * Authentication
       * ----------------------------------------------------------------------
       */

      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: "/login",
                element: <LoginPage />,
              },
              {
                path: "/register",
                element: <RegisterPage />,
              },
              {
                path: "/check-email",
                element: <CheckEmailPage />,
              },
              {
                path: "/resend-verification",
                element: <ResendVerificationPage />,
              },
              {
                path: "/forgot-password",
                element: <ForgotPasswordPage />,
              },
              {
                path: "/reset-password",
                element: <ResetPasswordPage />,
              },
            ],
          },
        ],
      },

      /*
       * ----------------------------------------------------------------------
       * Email verification
       * ----------------------------------------------------------------------
       */

      {
        element: <AuthLayout />,
        children: [
          {
            path: "/verify-email",
            element: <VerifyEmailPage />,
          },
        ],
      },

      /*
       * ----------------------------------------------------------------------
       * Protected application
       * ----------------------------------------------------------------------
       */

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              /*
               * General application routes
               */

              {
                path: "/dashboard",
                element: <DashboardPage />,
              },

              {
                path: "/profile",
                element: <ProfilePage />,
              },

              {
                path: "/settings",
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  /*
   * ------------------------------------------------------------------------
   * 404
   * ------------------------------------------------------------------------
   */

  {
    path: "*",
    element: <NotFound />,
  },
]);