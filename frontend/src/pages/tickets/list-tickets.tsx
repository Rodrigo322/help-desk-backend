import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Input } from "../../components/ui/input";
import { Loading } from "../../components/ui/loading";
import { Select } from "../../components/ui/select";
import { useTickets } from "../../hooks/use-tickets";
import {
  ticketFiltersSchema,
  TicketFiltersFormData,
  TicketFiltersFormInput
} from "../../schemas/tickets/filters-schema";
import { formatDate } from "../../utils/format-date";
import { formatPriority } from "../../utils/format-priority";
import { formatStatus } from "../../utils/format-status";

const defaultFilters: TicketFiltersFormData = {
  status: undefined,
  priority: undefined,
  userId: undefined,
  page: 1,
  pageSize: 10
};

function getStatusVariant(status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
  if (status === "OPEN") return "info";
  if (status === "IN_PROGRESS") return "warning";
  return "success";
}

export function ListTicketsPage() {
  const [filters, setFilters] = useState<TicketFiltersFormData>(defaultFilters);

  const form = useForm<TicketFiltersFormInput>({
    resolver: zodResolver(ticketFiltersSchema),
    defaultValues: {
      status: "",
      priority: "",
      userId: "",
      page: 1,
      pageSize: 10
    }
  });

  const ticketsQuery = useTickets(filters);

  function handleApplyFilters(values: TicketFiltersFormInput) {
    const parsed = ticketFiltersSchema.parse(values);
    setFilters({
      ...parsed,
      page: 1
    });
  }

  function handleChangePage(nextPage: number) {
    setFilters((previous) => ({
      ...previous,
      page: nextPage
    }));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-500">Filtros, paginação e detalhes dos chamados.</p>
        </div>
        <Link to="/tickets/new" className="text-sm font-semibold text-brand-700">
          + Novo ticket
        </Link>
      </header>

      <Card>
        <form className="grid gap-3 md:grid-cols-5" onSubmit={form.handleSubmit(handleApplyFilters)}>
          <Select
            label="Status"
            options={[
              { label: "Todos", value: "" },
              { label: "Aberto", value: "OPEN" },
              { label: "Em andamento", value: "IN_PROGRESS" },
              { label: "Fechado", value: "CLOSED" }
            ]}
            {...form.register("status")}
          />

          <Select
            label="Prioridade"
            options={[
              { label: "Todas", value: "" },
              { label: "Baixa", value: "LOW" },
              { label: "Média", value: "MEDIUM" },
              { label: "Alta", value: "HIGH" }
            ]}
            {...form.register("priority")}
          />

          <Input label="User ID" placeholder="UUID opcional" {...form.register("userId")} />

          <Select
            label="Page Size"
            options={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" }
            ]}
            {...form.register("pageSize")}
          />

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Aplicar filtros
            </Button>
          </div>
        </form>
      </Card>

      {ticketsQuery.isLoading ? <Loading /> : null}
      {ticketsQuery.isError ? <ErrorState message="Falha ao carregar tickets." /> : null}

      {!ticketsQuery.isLoading && !ticketsQuery.isError ? (
        ticketsQuery.data?.items.length ? (
          <div className="space-y-3">
            {ticketsQuery.data.items.map((ticket) => (
              <Card key={ticket.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900">{ticket.title}</h2>
                    <p className="text-sm text-slate-600">{ticket.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Criado em {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(ticket.status)}>{formatStatus(ticket.status)}</Badge>
                    <Badge variant="default">{formatPriority(ticket.priority)}</Badge>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-brand-700 underline"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Página {ticketsQuery.data.meta.page} de {ticketsQuery.data.meta.totalPages || 1} - Total:{" "}
                {ticketsQuery.data.meta.total}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={filters.page <= 1}
                  onClick={() => handleChangePage(filters.page - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  disabled={filters.page >= ticketsQuery.data.meta.totalPages}
                  onClick={() => handleChangePage(filters.page + 1)}
                >
                  Próxima
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <EmptyState title="Nenhum ticket encontrado" description="Ajuste filtros ou crie um novo chamado." />
        )
      ) : null}
    </div>
  );
}

