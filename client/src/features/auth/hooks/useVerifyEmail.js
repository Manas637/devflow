import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/api/auth/auth.api";

export default function useVerifyEmail(token){
  return useQuery({
    queryKey: ["verify-email", token],

    queryFn: () => verifyEmail(token),

    enabled: Boolean(token),

    // Very important for a one-time token
    retry: false,

    // Don't automatically run it again
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    // Verification is a one-time operation
    staleTime: Infinity,

    // Keep the result around
    gcTime: 5 * 60 * 1000,
  });
};