import { createSlice } from "@reduxjs/toolkit";

const getInitialOrganizationId = () => {
  return localStorage.getItem(
    "currentOrganizationId"
  );
};

const initialState = {
  currentOrganizationId:
    getInitialOrganizationId(),
};

const organizationSlice = createSlice({
  name: "organization",

  initialState,

  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganizationId =
        action.payload;

      localStorage.setItem(
        "currentOrganizationId",
        action.payload
      );
    },

    clearCurrentOrganization: (state) => {
      state.currentOrganizationId = null;

      localStorage.removeItem(
        "currentOrganizationId"
      );
    },
  },
});

export const {
  setCurrentOrganization,
  clearCurrentOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;