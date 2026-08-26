import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMyProjectMembership,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

const useGetMyProjectMembership = (
  projectId
) => {
  return useQuery({
    queryKey:
      PROJECT_QUERY_KEYS.membership(
        projectId
      ),

    queryFn: async () => {
      const response =
        await getMyProjectMembership(
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

export default useGetMyProjectMembership;