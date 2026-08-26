import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeOtherSessions } from "@/api/user/user.api";

export default function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await revokeOtherSessions();

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "sessions"],
      });
    },
  });
}