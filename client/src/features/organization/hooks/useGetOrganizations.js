import { useQuery } from "@tanstack/react-query";

import { getOrganizations } from "@/api/organization/organization.api";
import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

const useGetOrganizations = () => {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.list(),
    queryFn: getOrganizations,
  });
};

export default useGetOrganizations;