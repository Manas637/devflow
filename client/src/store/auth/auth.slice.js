import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,

  isInitializing: true,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  setUser,
  setLoading,
  setInitializing,
  logout,
} = authSlice.actions;

export default authSlice.reducer;