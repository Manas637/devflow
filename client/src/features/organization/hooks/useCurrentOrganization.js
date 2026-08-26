import { useSelector } from "react-redux";

import useGetOrganization from "./useGetOrganization";

const useCurrentOrganization = () => {
  const organizationId = useSelector(
    (state) =>
      state.organization.currentOrganizationId
  );

  const query = useGetOrganization(
    organizationId
  );

  return {
    organizationId,
    organization: query.data?.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export default useCurrentOrganization;