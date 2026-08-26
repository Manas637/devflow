import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProject,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

const useGetProject = (
  projectId
) => {
  return useQuery({
    queryKey:
      PROJECT_QUERY_KEYS.detail(
        projectId
      ),

    queryFn: async () => {
      const response =
        await getProject(
          projectId
        );

      return (
        response?.data?.data ??
        response?.data
      );
    },

    enabled: Boolean(
      projectId
    ),
  });
};

export default useGetProject;