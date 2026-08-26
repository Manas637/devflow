import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteOrganization } from "@/api/organization/organization.api";
import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.list(),
      });
    },
  });
};

export default useDeleteOrganization;