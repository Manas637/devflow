import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useUpdateProject = (
  projectId,
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateProject(
        projectId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.list(
            organizationId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.detail(
            projectId
          ),
      });

      toast.success(
        "Project updated successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update project."
      );
    },
  });
};

export default useUpdateProject;