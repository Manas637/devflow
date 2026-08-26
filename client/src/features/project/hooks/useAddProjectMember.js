import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProjectMember,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useAddProjectMember = (
  projectId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }) =>
      addProjectMember(
        projectId,
        {
          userId,
          role,
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.members(
            projectId
          ),
      });

      toast.success(
        "Member added successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add member."
      );
    },
  });
};

export default useAddProjectMember;