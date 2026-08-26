import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateMemberRole,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      memberId,
      role,
    }) =>
      updateMemberRole(
        organizationId,
        memberId,
        role
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

export default useUpdateMemberRole;