import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateOrganization } from "@/api/organization/organization.api";
import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }) =>
      updateOrganization(
        organizationId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.list(),
      });

      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.detail(
            variables.organizationId
          ),
      });
    },
  });
};

export default useUpdateOrganization;