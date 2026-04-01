import { useNavigate } from "react-router-dom";
import { Bell, HelpCircle } from "lucide-react";

import { CreateTicketForm } from "../../components/forms/create-ticket-form";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useDepartments } from "../../hooks/use-departments";
import { useCreateTicket } from "../../hooks/use-tickets";
import { CreateTicketFormData } from "../../schemas/tickets/create-ticket-schema";
import { getApiErrorMessage } from "../../services/api";

export function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicketMutation = useCreateTicket();
  const departmentsQuery = useDepartments();

  const errorMessage = createTicketMutation.isError
    ? getApiErrorMessage(createTicketMutation.error)
    : null;

  function handleCreateTicket(data: CreateTicketFormData) {
    createTicketMutation.reset();
    createTicketMutation.mutate(data, {
      onSuccess: (result) => {
        navigate(`/tickets/${result.ticket.id}`, { replace: true });
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Criar Chamado</h1>
          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados abaixo para abrir um novo ticket interno.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notificacoes"
          >
            <Bell size={16} />
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Ajuda"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      <Card className="mx-auto w-full max-w-6xl space-y-4 border-0 bg-transparent p-0 shadow-none">
        {departmentsQuery.isLoading ? <Loading /> : null}

        {departmentsQuery.isError ? (
          <ErrorState message={getApiErrorMessage(departmentsQuery.error)} />
        ) : null}

        {errorMessage ? <ErrorState message={errorMessage} /> : null}

        {!departmentsQuery.isLoading && !departmentsQuery.isError ? (
          <CreateTicketForm
            isLoading={createTicketMutation.isPending}
            departments={departmentsQuery.data?.departments ?? []}
            onSubmit={handleCreateTicket}
          />
        ) : null}
      </Card>
    </div>
  );
}
