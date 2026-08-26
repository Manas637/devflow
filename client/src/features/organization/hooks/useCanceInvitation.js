import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelInvitation,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      invitationId,
    }) =>
      cancelInvitation(
        organizationId,
        invitationId
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

export default useCancelInvitation;