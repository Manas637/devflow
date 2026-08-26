import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logout as logoutApi } from "@/api/auth/auth.api";
import { logout as clearAuth } from "@/store/auth";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      dispatch(clearAuth());

      toast.success("You have been signed out.");

      navigate("/login", {
        replace: true,
      });
    },

    onError: () => {
      /*
       * Even if the backend logout fails, clear the local
       * authentication state. The refresh token/session may
       * still exist server-side, but this client is no longer
       * considered authenticated.
       */
      dispatch(clearAuth());

      toast.error(
        "You have been signed out locally."
      );

      navigate("/login", {
        replace: true,
      });
    },
  });
}