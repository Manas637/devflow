import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/api/organization/organization.api";
import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useGetOrganization = (
  organizationId
) => {
  return useQuery({
    queryKey:
      ORGANIZATION_QUERY_KEYS.detail(
        organizationId
      ),

    queryFn: () =>
      getOrganization(organizationId),

    enabled: Boolean(organizationId),
  });
};

export default useGetOrganization;