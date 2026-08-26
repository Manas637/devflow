import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateProjectMemberRole,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useUpdateProjectMemberRole = (
  projectId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      membershipId,
      role,
    }) =>
      updateProjectMemberRole(
        projectId,
        membershipId,
        role
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.members(
            projectId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.membership(
            projectId
          ),
      });

      toast.success(
        "Member role updated successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update member role."
      );
    },
  });
};

export default useUpdateProjectMemberRole;