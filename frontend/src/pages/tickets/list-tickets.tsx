import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { PriorityBadge } from "../../components/ui/priority-badge";
import { Select } from "../../components/ui/select";
import { StatusBadge } from "../../components/ui/status-badge";
import { useTicketListing } from "../../hooks/use-ticket-listing";
import { formatDate } from "../../utils/format-date";

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Aberto", value: "OPEN" },
  { label: "Em andamento", value: "IN_PROGRESS" },
  { label: "Fechado", value: "CLOSED" }
];

const priorityOptions = [
  { label: "Todas", value: "" },
  { label: "Baixa", value: "LOW" },
  { label: "Media", value: "MEDIUM" },
  { label: "Alta", value: "HIGH" }
];

const pageSizeOptions = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" }
];

export function ListTicketsPage() {
  const {
    ticketsQuery,
    filters,
    handleStatusChange,
    handlePriorityChange,
    handlePageSizeChange,
    goToPreviousPage,
    goToNextPage
  } = useTicketListing();

  if (ticketsQuery.isLoading) {
    return <Loading />;
  }

  if (ticketsQuery.isError) {
    return <ErrorState message="Nao foi possivel carregar os tickets." />;
  }

  const tickets = ticketsQuery.data?.items ?? [];
  const meta = ticketsQuery.data?.meta;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Tickets</h1>
        <p className="text-sm text-slate-500">Lista de chamados com filtros e paginacao.</p>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status ?? ""}
            onChange={(event) =>
              handleStatusChange((event.target.value || undefined) as
                | "OPEN"
                | "IN_PROGRESS"
                | "CLOSED"
                | undefined)
            }
          />
          <Select
            label="Prioridade"
            options={priorityOptions}
            value={filters.priority ?? ""}
            onChange={(event) =>
              handlePriorityChange((event.target.value || undefined) as
                | "LOW"
                | "MEDIUM"
                | "HIGH"
                | undefined)
            }
          />
          <Select
            label="Itens por pagina"
            options={pageSizeOptions}
            value={String(filters.pageSize)}
            onChange={(event) => handlePageSizeChange(Number(event.target.value))}
          />
        </div>
      </Card>

      {!tickets.length ? (
        <EmptyState
          title="Nenhum ticket encontrado"
          description="Tente ajustar os filtros para ver resultados."
        />
      ) : (
        <>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="block">
                <Card className="transition hover:border-brand-500 hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-slate-900">{ticket.title}</h2>
                      <p className="text-xs text-slate-500">
                        Criado em {formatDate(ticket.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Pagina {meta?.page ?? filters.page} de {meta?.totalPages ?? 0} - Total:{" "}
              {meta?.total ?? 0}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={goToPreviousPage}
                disabled={(meta?.page ?? filters.page) <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                onClick={goToNextPage}
                disabled={(meta?.page ?? filters.page) >= (meta?.totalPages ?? 0)}
              >
                Proxima
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
