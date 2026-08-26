import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeSession } from "@/api/user/user.api";

export default function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId) => {
      const response = await revokeSession(sessionId);

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "sessions"],
      });
    },
  });
}