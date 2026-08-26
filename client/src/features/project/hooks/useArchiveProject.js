import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  archiveProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useArchiveProject = (
  projectId,
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      archiveProject(
        projectId
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
        "Project archived successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to archive project."
      );
    },
  });
};

export default useArchiveProject;