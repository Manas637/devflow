export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectAccessToken = (state) =>
  state.auth.accessToken;

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state) =>
  state.auth.loading;

export const selectIsInitalizing = (state) => state.auth.isInitializing;