import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useDispatch } from "react-redux";

import { createOrganization } from "@/api/organization/organization.api";

import {
  ORGANIZATION_QUERY_KEYS,
} from "../constants/organization.constants";

import {
  setCurrentOrganization,
} from "@/store/organization/organization.slice";

const useCreateOrganization = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,

    onSuccess: (response) => {
      const organization =
        response?.data?.data ??
        response?.data;

      if (!organization?.id) {
        console.error(
          "Created organization ID missing:",
          response
        );

        return;
      }

      /*
       * Immediately make the newly created
       * organization the active organization.
       */
      dispatch(
        setCurrentOrganization(
          organization.id
        )
      );

      /*
       * Refresh the organization list.
       */
      queryClient.invalidateQueries({
        queryKey:
          ORGANIZATION_QUERY_KEYS.list(),
      });
    },
  });
};

export default useCreateOrganization;