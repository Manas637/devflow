import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

import { toast } from "sonner";


const useCreateProject = (
  organizationId
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createProject(
        organizationId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          PROJECT_QUERY_KEYS.list(
            organizationId
          ),
      });

      toast.success(
        "Project created successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create project."
      );
    },
  });
};

export default useCreateProject;