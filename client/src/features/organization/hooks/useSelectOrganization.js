import { useDispatch } from "react-redux";

import {
  setCurrentOrganization,
} from "../organization.store";

const useSelectOrganization = () => {
  const dispatch = useDispatch();

  const selectOrganization = (
    organizationId
  ) => {
    dispatch(
      setCurrentOrganization(
        organizationId
      )
    );
  };

  return selectOrganization;
};

export default useSelectOrganization;