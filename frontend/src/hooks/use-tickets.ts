import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ticketFiltersSchema, TicketFiltersFormData } from "../schemas/tickets/filters-schema";
import { createTicketSchema, CreateTicketFormData } from "../schemas/tickets/create-ticket-schema";
import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { CreateTicketResponse, ListTicketsResponse } from "../types/ticket";

function normalizeFilters(filters: TicketFiltersFormData): TicketFiltersFormData {
  const parsed = ticketFiltersSchema.parse(filters);
  return {
    ...parsed,
    status: parsed.status || undefined,
    priority: parsed.priority || undefined,
    userId: parsed.userId || undefined
  };
}

export function useTickets(filters: TicketFiltersFormData) {
  const normalizedFilters = normalizeFilters(filters);

  return useQuery({
    queryKey: ["tickets", normalizedFilters],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListTicketsResponse>>("/tickets", {
        params: normalizedFilters
      });

      return unwrapApiResponse(response.data);
    }
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketFormData): Promise<CreateTicketResponse> => {
      const parsedPayload = createTicketSchema.parse(payload);
      const response = await api.post<ApiResponse<CreateTicketResponse>>("/tickets", parsedPayload);
      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}
