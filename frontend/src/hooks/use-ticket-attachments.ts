import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrapApiResponse } from "../services/api";
import { ApiResponse } from "../types/api";
import { ListTicketAttachmentsResponse, UploadAttachmentResponse } from "../types/attachment";

export function useTicketAttachments(ticketId: string) {
  return useQuery({
    queryKey: ["ticket-attachments", ticketId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ListTicketAttachmentsResponse>>(
        `/tickets/${ticketId}/attachments`
      );

      return unwrapApiResponse(response.data);
    },
    enabled: Boolean(ticketId)
  });
}

export function useUploadTicketAttachment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<ApiResponse<UploadAttachmentResponse>>(
        `/tickets/${ticketId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return unwrapApiResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-attachments", ticketId] });
    }
  });
}

