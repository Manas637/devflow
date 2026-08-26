import { useQuery } from "@tanstack/react-query";

import {
  getOrganizationMembers,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useGetOrganizationMembers = (
  organizationId
) => {
  return useQuery({
    queryKey:
      ORGANIZATION_QUERY_KEYS.members(
        organizationId
      ),

    queryFn: () =>
      getOrganizationMembers(
        organizationId
      ),

    enabled: Boolean(organizationId),
  });
};

export default useGetOrganizationMembers;