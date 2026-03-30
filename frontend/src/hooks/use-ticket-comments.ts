import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { CreateCommentResponse, ListTicketCommentsResponse } from "../types/comment";

type CreateCommentPayload = {
  content: string;
};

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ["ticket-comments", ticketId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListTicketCommentsResponse>>(
        `/tickets/${ticketId}/comments`
      );

      return unwrapApiResponse(response.data);
    },
    enabled: Boolean(ticketId)
  });
}

export function useCreateTicketComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const response = await api.post<ApiResponse<CreateCommentResponse>>(
        `/tickets/${ticketId}/comments`,
        payload
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", ticketId] });
    }
  });
}

