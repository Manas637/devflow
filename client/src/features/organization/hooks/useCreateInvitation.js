import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createInvitation,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }) =>
      createInvitation(
        organizationId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.invitations(
            variables.organizationId
          ),
      });
    },
  });
};

export default useCreateInvitation;