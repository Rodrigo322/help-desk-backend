import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { ticketFiltersSchema } from "../schemas/tickets/filters-schema";
import { api, getApiErrorMessage } from "../services/api";
import { ApiResponse } from "../types/api";
import { ListTicketsResponse, TicketListingScope, TicketStatus } from "../types/ticket";

type TicketCountFilters = {
  scope: TicketListingScope;
  status?: TicketStatus;
};

function getPathByScope(scope: TicketListingScope): string {
  if (scope === "created") {
    return "/tickets/me/created";
  }

  if (scope === "assigned") {
    return "/tickets/me/assigned";
  }

  return "/tickets";
}

async function fetchTicketCount(filters: TicketCountFilters): Promise<number> {
  const params = ticketFiltersSchema.parse({
    scope: filters.scope,
    status: filters.status,
    page: 1,
    pageSize: 1
  });

  const response = await api.get<ApiResponse<ListTicketsResponse>>(getPathByScope(filters.scope), {
    params: {
      status: params.status,
      priority: params.priority,
      page: params.page,
      pageSize: params.pageSize
    }
  });

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data.meta.total;
}

export function useDashboard() {
  const [departmentTotalQuery, createdTotalQuery, assignedTotalQuery, openDepartmentQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["dashboard", "ticket-count", "department", "all"],
          queryFn: () => fetchTicketCount({ scope: "department" })
        },
        {
          queryKey: ["dashboard", "ticket-count", "created", "all"],
          queryFn: () => fetchTicketCount({ scope: "created" })
        },
        {
          queryKey: ["dashboard", "ticket-count", "assigned", "all"],
          queryFn: () => fetchTicketCount({ scope: "assigned" })
        },
        {
          queryKey: ["dashboard", "ticket-count", "department", "OPEN"],
          queryFn: () => fetchTicketCount({ scope: "department", status: "OPEN" })
        }
      ]
    });

  const isLoading =
    departmentTotalQuery.isLoading ||
    createdTotalQuery.isLoading ||
    assignedTotalQuery.isLoading ||
    openDepartmentQuery.isLoading;

  const isError =
    departmentTotalQuery.isError ||
    createdTotalQuery.isError ||
    assignedTotalQuery.isError ||
    openDepartmentQuery.isError;

  const error =
    departmentTotalQuery.error ??
    createdTotalQuery.error ??
    assignedTotalQuery.error ??
    openDepartmentQuery.error;

  const metrics = useMemo(
    () => ({
      departmentTotal: departmentTotalQuery.data ?? 0,
      createdTotal: createdTotalQuery.data ?? 0,
      assignedTotal: assignedTotalQuery.data ?? 0,
      openDepartmentTotal: openDepartmentQuery.data ?? 0
    }),
    [
      departmentTotalQuery.data,
      createdTotalQuery.data,
      assignedTotalQuery.data,
      openDepartmentQuery.data
    ]
  );

  return {
    metrics,
    isLoading,
    isError,
    errorMessage: error ? getApiErrorMessage(error) : null
  };
}
