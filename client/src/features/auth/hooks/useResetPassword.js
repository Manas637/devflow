import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/auth/auth.api";
import { toast } from "sonner";

export default function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: (response) => {
      toast.success(
        response?.data?.message ??
          "Password reset successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to reset your password. Please try again."
      );
    },
  });
}