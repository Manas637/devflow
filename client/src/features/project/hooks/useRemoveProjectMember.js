import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  removeProjectMember,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useRemoveProjectMember = (
  projectId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (membershipId) =>
      removeProjectMember(
        projectId,
        membershipId
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
        "Member removed successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to remove member."
      );
    },
  });
};

export default useRemoveProjectMember;