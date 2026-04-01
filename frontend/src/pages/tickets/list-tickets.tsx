import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { PriorityBadge } from "../../components/ui/priority-badge";
import { Select } from "../../components/ui/select";
import { StatusBadge } from "../../components/ui/status-badge";
import { useDepartments } from "../../hooks/use-departments";
import { useTicketListing } from "../../hooks/use-ticket-listing";
import { getApiErrorMessage } from "../../services/api";
import { TicketListingScope, TicketStatus } from "../../types/ticket";
import { formatDate } from "../../utils/format-date";

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Novo", value: "NEW" },
  { label: "Aberto", value: "OPEN" },
  { label: "Em andamento", value: "IN_PROGRESS" },
  { label: "Pendente", value: "PENDING" },
  { label: "Em espera", value: "ON_HOLD" },
  { label: "Resolvido", value: "RESOLVED" },
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

const scopeOptions: Array<{ label: string; value: TicketListingScope }> = [
  { label: "Do meu departamento", value: "department" },
  { label: "Que eu criei", value: "created" },
  { label: "Atribuidos a mim", value: "assigned" }
];

export function ListTicketsPage() {
  const {
    ticketsQuery,
    filters,
    handleScopeChange,
    handleStatusChange,
    handlePriorityChange,
    handlePageSizeChange,
    goToPreviousPage,
    goToNextPage
  } = useTicketListing();

  const departmentsQuery = useDepartments();

  if (ticketsQuery.isLoading || departmentsQuery.isLoading) {
    return <Loading />;
  }

  if (ticketsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(ticketsQuery.error)} />;
  }

  if (departmentsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(departmentsQuery.error)} />;
  }

  const tickets = ticketsQuery.data?.items ?? [];
  const meta = ticketsQuery.data?.meta;
  const departmentsById = new Map(
    (departmentsQuery.data?.departments ?? []).map((department) => [department.id, department.name])
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Tickets</h1>
        <p className="text-sm text-slate-500">Listagem por escopo, com filtros e paginacao.</p>
      </header>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {scopeOptions.map((scope) => (
            <Button
              key={scope.value}
              type="button"
              variant={filters.scope === scope.value ? "primary" : "secondary"}
              onClick={() => handleScopeChange(scope.value)}
            >
              {scope.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status ?? ""}
            onChange={(event) => handleStatusChange((event.target.value || undefined) as TicketStatus | undefined)}
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
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-slate-900">{ticket.title}</h2>
                      <p className="text-xs text-slate-500">Criado em {formatDate(ticket.createdAt)}</p>
                      <p className="text-xs text-slate-600">
                        Origem: {departmentsById.get(ticket.originDepartmentId) ?? ticket.originDepartmentId}
                      </p>
                      <p className="text-xs text-slate-600">
                        Destino: {departmentsById.get(ticket.targetDepartmentId) ?? ticket.targetDepartmentId}
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
              Pagina {meta?.page ?? filters.page} de {meta?.totalPages ?? 0} - Total: {meta?.total ?? 0}
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
