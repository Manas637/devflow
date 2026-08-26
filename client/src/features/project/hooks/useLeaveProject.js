import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  leaveProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useLeaveProject = (
  projectId,
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      leaveProject(projectId),

    onSuccess: () => {
      /*
       * Remove the current user's
       * project membership cache.
       */
      queryClient.removeQueries({
        queryKey:
          PROJECT_QUERY_KEYS.membership(
            projectId
          ),
      });

      /*
       * Refresh the project members list.
       */
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.members(
            projectId
          ),
      });

      /*
       * The user no longer has access
       * to this project, so refresh the
       * organization project list.
       */
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.list(
            organizationId
          ),
      });

      toast.success(
        "You left the project successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to leave project."
      );
    },
  });
};

export default useLeaveProject;