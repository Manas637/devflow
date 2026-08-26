import { useQuery } from "@tanstack/react-query";

import { getSessions } from "@/api/user/user.api";

export default function useSessions() {
  return useQuery({
    queryKey: ["user", "sessions"],
    queryFn: async () => {
      const response = await getSessions();

      return response.data.data;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });
}