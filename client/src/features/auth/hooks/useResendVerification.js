import { useMutation } from "@tanstack/react-query";

import { resendVerification } from "@/api/auth/auth.api";

import { toast } from "sonner"

export default function useResendVerification() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await resendVerification(data);

      return response.data;
      },
      
    onSuccess: (response) => {
      toast.success(
        response?.data?.message ??
          "Verification email send successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to send verification email. Please try again."
      );
    },

    retry: false,
  });
}