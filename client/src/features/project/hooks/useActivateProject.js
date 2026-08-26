import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  activateProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";

const useActivateProject = (
  projectId,
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      activateProject(
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
        "Project activated successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to activate project."
      );
    },
  });
};

export default useActivateProject;