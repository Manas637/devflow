import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearCurrentOrganization,
  setCurrentOrganization,
} from "@/store/organization/organization.slice";

import useGetOrganizations from "./useGetOrganizations";

const useInitializeOrganization = () => {
  const dispatch = useDispatch();

  const currentOrganizationId = useSelector(
    (state) =>
      state.organization?.currentOrganizationId
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetOrganizations();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const organizations =
    data?.data?.data ?? [];

  useEffect(() => {
    /*
     * Don't modify the current organization while
     * the organization list is being fetched/refetched.
     *
     * This is especially important after creating
     * a new organization because invalidateQueries()
     * triggers a background refetch.
     */
    if (
      isLoading ||
      isFetching ||
      isError
    ) {
      return;
    }

    /*
     * No organizations available.
     */
    if (organizations.length === 0) {
      if (currentOrganizationId !== null) {
        dispatch(
          clearCurrentOrganization()
        );
      }

      return;
    }

    /*
     * Keep the currently selected organization
     * if it still exists.
     */
    const currentOrganizationExists =
      organizations.some(
        (organization) =>
          organization.id ===
          currentOrganizationId
      );

    if (currentOrganizationExists) {
      return;
    }

    /*
     * Current organization is invalid/missing,
     * so select the first available organization.
     */
    dispatch(
      setCurrentOrganization(
        organizations[0].id
      )
    );
  }, [
    organizations,
    currentOrganizationId,
    isLoading,
    isFetching,
    isError,
    dispatch,
  ]);

  return {
    organizations,
    isLoading,
    isFetching,
    isError,
    error,
  };
};

export default useInitializeOrganization;