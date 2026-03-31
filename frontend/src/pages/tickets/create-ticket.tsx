import { useNavigate } from "react-router-dom";

import { CreateTicketForm } from "../../components/forms/create-ticket-form";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { useCreateTicket } from "../../hooks/use-tickets";
import { CreateTicketFormData } from "../../schemas/tickets/create-ticket-schema";
import { getApiErrorMessage } from "../../services/api";

export function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicketMutation = useCreateTicket();
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
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Criar ticket</h1>
        <p className="text-sm text-slate-500">Abra um novo chamado com prioridade inicial.</p>
      </header>

      <Card className="max-w-2xl space-y-4">
        {errorMessage ? <ErrorState message={errorMessage} /> : null}

        <CreateTicketForm
          isLoading={createTicketMutation.isPending}
          onSubmit={handleCreateTicket}
        />
      </Card>
    </div>
  );
}
