import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/user/user.api";

export default function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}