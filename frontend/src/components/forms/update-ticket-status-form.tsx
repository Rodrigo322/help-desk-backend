import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TicketStatus } from "../../types/ticket";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])
});

type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

type UpdateTicketStatusFormProps = {
  currentStatus: TicketStatus;
  isLoading: boolean;
  onSubmit: (data: UpdateStatusFormData) => Promise<void> | void;
};

export function UpdateTicketStatusForm({
  currentStatus,
  isLoading,
  onSubmit
}: UpdateTicketStatusFormProps) {
  const form = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: currentStatus
    }
  });

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Select
        label="Status"
        options={[
          { label: "Aberto", value: "OPEN" },
          { label: "Em andamento", value: "IN_PROGRESS" },
          { label: "Fechado", value: "CLOSED" }
        ]}
        error={form.formState.errors.status?.message}
        {...form.register("status")}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Atualizando..." : "Atualizar status"}
      </Button>
    </form>
  );
}

