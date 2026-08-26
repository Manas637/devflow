import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useDeleteProject = (
  projectId,
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteProject(
        projectId
      ),

    onSuccess: () => {
      /*
       * Refresh project list.
       */
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.list(
            organizationId
          ),
      });

      /*
       * Remove deleted project
       * from the detail cache.
       */
      queryClient.removeQueries({
        queryKey:
          PROJECT_QUERY_KEYS.detail(
            projectId
          ),
      });

      /*
       * Remove project-related caches.
       */
      queryClient.removeQueries({
        queryKey:
          PROJECT_QUERY_KEYS.members(
            projectId
          ),
      });

      queryClient.removeQueries({
        queryKey:
          PROJECT_QUERY_KEYS.membership(
            projectId
          ),
      });

      toast.success(
        "Project deleted successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete project."
      );
    },
  });
};

export default useDeleteProject;