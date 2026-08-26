import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { removeMember } from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
    }) =>
      removeMember(
        organizationId,
        memberId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.members(
            variables.organizationId
          ),
      });
    },
  });
};

export default useRemoveMember;