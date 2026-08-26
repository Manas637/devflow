import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { login } from "@/api/auth/auth.api";
import { setCredentials } from "@/store/auth";

export default function useLogin() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,

    onSuccess: ({ data }) => {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
    },
  });
}