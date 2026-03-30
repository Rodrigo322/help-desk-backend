import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { GetTicketDetailsResponse, TicketStatus } from "../types/ticket";

type UpdateTicketStatusPayload = {
  status: TicketStatus;
};

export function useTicketDetails(ticketId: string) {
  return useQuery({
    queryKey: ["ticket-details", ticketId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<GetTicketDetailsResponse>>(`/tickets/${ticketId}`);
      return unwrapApiResponse(response.data);
    },
    enabled: Boolean(ticketId)
  });
}

export function useUpdateTicketStatus(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTicketStatusPayload) => {
      const response = await api.patch<ApiResponse<GetTicketDetailsResponse>>(
        `/tickets/${ticketId}/status`,
        payload
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-details", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}

