import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProjectsByOrganization,
} from "@/api/project/project.api";

import {
  PROJECT_QUERY_KEYS,
} from "../constants/project.constants";

const useGetProjectsByOrganization = (
  organizationId
) => {
  return useQuery({
    queryKey:
      PROJECT_QUERY_KEYS.list(
        organizationId
      ),

    queryFn: async () => {
      const response =
        await getProjectsByOrganization(
          organizationId
        );

      return (
        response?.data?.data ??
        response?.data
      );
    },

    enabled: Boolean(
      organizationId
    ),
  });
};

export default useGetProjectsByOrganization;