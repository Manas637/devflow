import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth/auth.api";
import { toast } from "sonner";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: (response) => {
      toast.success(
        response?.data?.message ??
          "If an account exists, a password reset link has been sent."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to process your request. Please try again."
      );
    },
  });
}