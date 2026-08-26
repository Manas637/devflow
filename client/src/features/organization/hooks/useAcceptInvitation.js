import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  acceptInvitation,
} from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvitation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.list(),
      }); 
    },
  });
};

export default useAcceptInvitation;