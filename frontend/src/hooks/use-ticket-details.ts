import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { updateTicketStatusSchema } from "../schemas/tickets/update-ticket-status-schema";
import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import {
  GetTicketDetailsResponse,
  UpdateTicketStatusPayload,
  UpdateTicketStatusResponse
} from "../types/ticket";

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
      const parsedPayload = updateTicketStatusSchema.parse(payload);
      const response = await api.patch<ApiResponse<UpdateTicketStatusResponse>>(
        `/tickets/${ticketId}/status`,
        parsedPayload
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-details", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}
