import { useSelector } from "react-redux";

import {
  selectAuth,
  selectUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/store/auth";

export default function useAuth() {
  return {
    auth: useSelector(selectAuth),
    user: useSelector(selectUser),
    accessToken: useSelector(selectAccessToken),
    isAuthenticated: useSelector(selectIsAuthenticated),
    loading: useSelector(selectAuthLoading),
  };
}