import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createTicketSchema,
  CreateTicketFormData
} from "../../schemas/tickets/create-ticket-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

type CreateTicketFormProps = {
  isLoading: boolean;
  onSubmit: (data: CreateTicketFormData) => Promise<void> | void;
};

export function CreateTicketForm({ isLoading, onSubmit }: CreateTicketFormProps) {
  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM"
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Título" error={form.formState.errors.title?.message} {...form.register("title")} />

      <Textarea
        label="Descrição"
        rows={5}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <Select
        label="Prioridade"
        error={form.formState.errors.priority?.message}
        options={[
          { label: "Baixa", value: "LOW" },
          { label: "Média", value: "MEDIUM" },
          { label: "Alta", value: "HIGH" }
        ]}
        {...form.register("priority")}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Criando..." : "Criar ticket"}
      </Button>
    </form>
  );
}

