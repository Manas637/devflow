import { useQuery } from "@tanstack/react-query";

import { getInvitations } from "@/api/organization/organization.api";
import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useGetInvitations = (
  organizationId
) => {
  return useQuery({
    queryKey:
      ORGANIZATION_QUERY_KEYS.invitations(
        organizationId
      ),

    queryFn: () =>
      getInvitations(organizationId),

    enabled: Boolean(organizationId),
  });
};

export default useGetInvitations;