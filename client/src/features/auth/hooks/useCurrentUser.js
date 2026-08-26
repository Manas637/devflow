import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth/auth.api";

export default function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await getCurrentUser();
      return data.data;
    },

    staleTime: 5 * 60 * 1000,
  });
}