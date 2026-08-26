// src/features/user/hooks/useUpdateProfile.js

import { useMutation } from "@tanstack/react-query";

import { updateProfile } from "@/api/user/user.api";
import { setUser } from "@/store/auth";
import { useDispatch } from "react-redux";

export default function useUpdateProfile() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: ({ data }) => {
      dispatch(setUser(data.data));
    },
  });
}