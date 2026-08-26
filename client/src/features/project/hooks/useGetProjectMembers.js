import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProjectMembers,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

const useGetProjectMembers = (
  projectId
) => {
  return useQuery({
    queryKey:
      PROJECT_QUERY_KEYS.members(
        projectId
      ),

    queryFn: async () => {
      const response =
        await getProjectMembers(
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

export default useGetProjectMembers;