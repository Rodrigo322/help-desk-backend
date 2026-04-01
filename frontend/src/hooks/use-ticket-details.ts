import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import {
  AssignTicketToSelfResponse,
  CloseTicketResponse,
  GetTicketDetailsResponse
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

export function useAssignTicketToSelf(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<ApiResponse<AssignTicketToSelfResponse>>(
        `/tickets/${ticketId}/assign`
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-details", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}

export function useCloseTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch<ApiResponse<CloseTicketResponse>>(
        `/tickets/${ticketId}/close`
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-details", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}
