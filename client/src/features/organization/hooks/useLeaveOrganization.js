import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  leaveOrganization,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useLeaveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.list(),
      });
    },
  });
};

export default useLeaveOrganization;