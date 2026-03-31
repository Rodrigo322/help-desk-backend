import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { ticketFiltersSchema, TicketFiltersFormData } from "../schemas/tickets/filters-schema";
import { TicketPriority, TicketStatus } from "../types/ticket";
import { useTickets } from "./use-tickets";

const DEFAULT_FILTERS: TicketFiltersFormData = {
  status: undefined,
  priority: undefined,
  userId: undefined,
  page: 1,
  pageSize: 10
};

function parseFiltersFromSearchParams(searchParams: URLSearchParams): TicketFiltersFormData {
  const parsed = ticketFiltersSchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    userId: searchParams.get("userId") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined
  });

  if (!parsed.success) {
    return DEFAULT_FILTERS;
  }

  return parsed.data;
}

function buildSearchParams(filters: TicketFiltersFormData): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  if (filters.userId) {
    params.set("userId", filters.userId);
  }

  if (filters.page !== DEFAULT_FILTERS.page) {
    params.set("page", String(filters.page));
  }

  if (filters.pageSize !== DEFAULT_FILTERS.pageSize) {
    params.set("pageSize", String(filters.pageSize));
  }

  return params;
}

export function useTicketListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const ticketsQuery = useTickets(filters);

  function commitFilters(nextFilters: TicketFiltersFormData) {
    const validatedFilters = ticketFiltersSchema.parse(nextFilters);
    setSearchParams(buildSearchParams(validatedFilters), { replace: true });
  }

  function handleStatusChange(status: TicketStatus | undefined) {
    commitFilters({
      ...filters,
      status,
      page: 1
    });
  }

  function handlePriorityChange(priority: TicketPriority | undefined) {
    commitFilters({
      ...filters,
      priority,
      page: 1
    });
  }

  function handlePageSizeChange(pageSize: number) {
    commitFilters({
      ...filters,
      pageSize,
      page: 1
    });
  }

  function goToPreviousPage() {
    if (filters.page <= 1) {
      return;
    }

    commitFilters({
      ...filters,
      page: filters.page - 1
    });
  }

  function goToNextPage() {
    const totalPages = ticketsQuery.data?.meta.totalPages ?? 0;

    if (filters.page >= totalPages) {
      return;
    }

    commitFilters({
      ...filters,
      page: filters.page + 1
    });
  }

  return {
    ticketsQuery,
    filters,
    handleStatusChange,
    handlePriorityChange,
    handlePageSizeChange,
    goToPreviousPage,
    goToNextPage
  };
}

