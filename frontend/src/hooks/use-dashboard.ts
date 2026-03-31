import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ticketFiltersSchema } from "../schemas/tickets/filters-schema";
import { api } from "../services/api";
import { ApiResponse } from "../types/api";
import { ListTicketsResponse, TicketStatus } from "../types/ticket";

type TicketCountFilters = {
  status?: TicketStatus;
};

async function fetchTicketCount(filters: TicketCountFilters = {}): Promise<number> {
  const params = ticketFiltersSchema.parse({
    status: filters.status,
    page: 1,
    pageSize: 1
  });

  const response = await api.get<ApiResponse<ListTicketsResponse>>("/tickets", { params });

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data.meta.total;
}

function getDashboardErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message;

    if (message) {
      return message;
    }

    return "Nao foi possivel carregar os indicadores da dashboard.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao carregar a dashboard.";
}

export function useDashboard() {
  const [totalQuery, openQuery, inProgressQuery, closedQuery] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "ticket-count", "all"],
        queryFn: () => fetchTicketCount()
      },
      {
        queryKey: ["dashboard", "ticket-count", "OPEN"],
        queryFn: () => fetchTicketCount({ status: "OPEN" })
      },
      {
        queryKey: ["dashboard", "ticket-count", "IN_PROGRESS"],
        queryFn: () => fetchTicketCount({ status: "IN_PROGRESS" })
      },
      {
        queryKey: ["dashboard", "ticket-count", "CLOSED"],
        queryFn: () => fetchTicketCount({ status: "CLOSED" })
      }
    ]
  });

  const isLoading =
    totalQuery.isLoading ||
    openQuery.isLoading ||
    inProgressQuery.isLoading ||
    closedQuery.isLoading;

  const isError = totalQuery.isError || openQuery.isError || inProgressQuery.isError || closedQuery.isError;

  const error = totalQuery.error ?? openQuery.error ?? inProgressQuery.error ?? closedQuery.error;

  const metrics = useMemo(
    () => ({
      total: totalQuery.data ?? 0,
      open: openQuery.data ?? 0,
      inProgress: inProgressQuery.data ?? 0,
      closed: closedQuery.data ?? 0
    }),
    [totalQuery.data, openQuery.data, inProgressQuery.data, closedQuery.data]
  );

  return {
    metrics,
    isLoading,
    isError,
    errorMessage: error ? getDashboardErrorMessage(error) : null
  };
}
