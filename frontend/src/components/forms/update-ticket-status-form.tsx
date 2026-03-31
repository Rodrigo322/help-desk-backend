import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  buildUpdateTicketStatusSchema,
  UpdateTicketStatusFormData
} from "../../schemas/tickets/update-ticket-status-schema";
import { TicketStatus } from "../../types/ticket";
import { getAllowedNextTicketStatuses } from "../../utils/ticket-status-transition";
import { formatStatus } from "../../utils/format-status";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

type UpdateTicketStatusFormProps = {
  currentStatus: TicketStatus;
  isLoading: boolean;
  onSubmit: (data: UpdateTicketStatusFormData) => Promise<void> | void;
};

const availableStatuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];

export function UpdateTicketStatusForm({
  currentStatus,
  isLoading,
  onSubmit
}: UpdateTicketStatusFormProps) {
  const allowedNextStatuses = useMemo(
    () => getAllowedNextTicketStatuses(currentStatus),
    [currentStatus]
  );

  const schema = useMemo(
    () => buildUpdateTicketStatusSchema(currentStatus),
    [currentStatus]
  );

  const form = useForm<UpdateTicketStatusFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: allowedNextStatuses[0] ?? currentStatus
    }
  });

  useEffect(() => {
    form.reset({
      status: allowedNextStatuses[0] ?? currentStatus
    });
  }, [allowedNextStatuses, currentStatus, form]);

  const options = useMemo(
    () =>
      availableStatuses.map((status) => ({
        label: formatStatus(status),
        value: status,
        disabled: !allowedNextStatuses.includes(status)
      })),
    [allowedNextStatuses]
  );

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Select
        label="Novo status"
        options={options}
        disabled={isLoading || !allowedNextStatuses.length}
        error={form.formState.errors.status?.message}
        {...form.register("status")}
      />

      <Button type="submit" disabled={isLoading || !allowedNextStatuses.length}>
        {isLoading ? "Atualizando..." : "Atualizar status"}
      </Button>

      {!allowedNextStatuses.length ? (
        <p className="text-xs text-slate-500">Este ticket nao permite novas transicoes de status.</p>
      ) : null}
    </form>
  );
}
