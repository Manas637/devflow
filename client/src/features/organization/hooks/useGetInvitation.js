import { useQuery } from "@tanstack/react-query";

import {
  getInvitation,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useGetInvitation = (token, userId) => {
  return useQuery({
    queryKey:
      ORGANIZATION_QUERY_KEYS.invitation(
        token,
        userId
      ),

    queryFn: () =>
      getInvitation(token),

    enabled: Boolean(token),

    staleTime: 0,

    refetchOnMount: true,

    refetchOnWindowFocus: false,

    retry: false,
  });
};

export default useGetInvitation;