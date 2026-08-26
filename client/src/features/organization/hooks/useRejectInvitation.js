import { useMutation } from "@tanstack/react-query";

import {
  rejectInvitation,
} from "@/api/organization/organization.api";
import { queryClient } from "@/lib/react-query";
import { ORGANIZATION_QUERY_KEYS } from "../constants/organization.constants";

const useRejectInvitation = () => {
  return useMutation({
      mutationFn: rejectInvitation,
      
      onSuccess: (_, token) => {
            queryClient.invalidateQueries({
              queryKey:
                ORGANIZATION_QUERY_KEYS.list(),
            }); 
            queryClient.invalidateQueries({
              queryKey:
              ORGANIZATION_QUERY_KEYS.invitation(token),
            });
        },
  });
};

export default useRejectInvitation;