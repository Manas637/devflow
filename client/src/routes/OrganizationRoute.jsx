import { Navigate, Outlet } from "react-router-dom";

import LoadingScreen from "@/components/feedback/LoadingScreen";

import useInitializeOrganization from "@/features/organization/hooks/useInitializeOrganization";
import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";

export default function OrganizationRoute() {
  const {
    organizations,
    isLoading,
    isError,
  } = useInitializeOrganization();

  const {
    organization,
    organizationId,
    isLoading: organizationLoading,
  } = useCurrentOrganization();

  if (isLoading) {
    return (
      <LoadingScreen message="Loading organizations..." />
    );
  }

  if (isError) {
    return null;
  }

  /*
   * User has no organizations.
   * Send them back to dashboard where
   * NoOrganizationState is displayed.
   */
  if (
    organizations.length === 0 &&
    !organizationId
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  /*
   * Organizations exist but the selected
   * organization hasn't been initialized yet.
   */
  if (
    organizations.length > 0 &&
    !organizationId
  ) {
    return (
      <LoadingScreen message="Loading organization..." />
    );
  }

  if (organizationLoading) {
    return (
      <LoadingScreen message="Loading organization..." />
    );
  }

  /*
   * Selected organization no longer exists.
   * Let the initialization flow recover instead
   * of rendering organization pages with null data.
   */
  if (!organization) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}