import {
  useQuery,
} from "@tanstack/react-query";

import {
  searchOrganizationMembers,
} from "@/api/organization/organization.api";

const useSearchOrganizationMembers = (
  organizationId,
  search
) => {
  return useQuery({
    queryKey: [
      "organization-members",
      "search",
      organizationId,
      search,
    ],

    queryFn: async () => {
      const response =
        await searchOrganizationMembers(
          organizationId,
          search
        );

      return (
        response?.data?.data ??
        response?.data ??
        []
      );
    },

    enabled:
      Boolean(organizationId) &&
      search.trim().length >= 2,

    staleTime: 30 * 1000,
  });
};

export default useSearchOrganizationMembers;