import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  selectIsInitalizing,
  setCredentials,
  setInitializing,
} from "@/store/auth";

import { refresh } from "@/api/auth/auth.api";

import LoadingScreen from "@/components/feedback/LoadingScreen";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const isInitializing = useSelector(
    selectIsInitalizing
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data } = await refresh();

        dispatch(
          setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
          })
        );
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setInitializing(false));
      }
    };

    initialize();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <LoadingScreen message="Restoring your session..." />
    );
  }

  return children;
}