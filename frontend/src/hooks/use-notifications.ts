import { useQuery } from "@tanstack/react-query";

import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { ListMyNotificationsResponse } from "../types/notification";

export function useMyNotifications(enabled = true) {
  return useQuery({
    queryKey: ["notifications", "me"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListMyNotificationsResponse>>("/notifications/me");
      return unwrapApiResponse(response.data);
    },
    enabled
  });
}
