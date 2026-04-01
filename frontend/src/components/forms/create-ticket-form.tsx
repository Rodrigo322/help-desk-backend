import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, CloudUpload, FileText, SendHorizontal, TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { createTicketSchema, CreateTicketFormData } from "../../schemas/tickets/create-ticket-schema";
import { Department } from "../../types/department";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

type CreateTicketFormProps = {
  isLoading: boolean;
  departments: Department[];
  onSubmit: (data: CreateTicketFormData) => Promise<void> | void;
};

export function CreateTicketForm({ isLoading, departments, onSubmit }: CreateTicketFormProps) {
  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      targetDepartmentId: ""
    }
  });

  const priority = form.watch("priority");

  const departmentOptions = [
    { label: "Selecione o departamento", value: "" },
    ...departments.map((department) => ({
      label: department.name,
      value: department.id
    }))
  ];

  const slaEstimate = useMemo(() => {
    if (priority === "HIGH") {
      return "24h uteis";
    }

    if (priority === "LOW") {
      return "72h uteis";
    }

    return "48h uteis";
  }, [priority]);

  return (
    <form className="space-y-0" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-6 p-6 lg:border-r lg:border-slate-100 lg:p-8">
            <Input
              label="Titulo do chamado"
              placeholder="Ex: Falha no sistema de notas fiscais"
              error={form.formState.errors.title?.message}
              {...form.register("title")}
            />

            <Textarea
              label="Descricao detalhada"
              placeholder="Descreva o problema ou solicitacao com o maximo de detalhes possivel..."
              rows={8}
              error={form.formState.errors.description?.message}
              {...form.register("description")}
            />

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Anexos</p>
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <CloudUpload size={36} className="mx-auto text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">Area de anexos no detalhe do ticket</p>
                <p className="mt-1 text-xs text-slate-400">
                  Esta tela permanece focada no cadastro sem alterar sua logica atual.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-slate-50/80 p-6 lg:p-8">
            <Select
              label="Departamento de destino"
              error={form.formState.errors.targetDepartmentId?.message}
              options={departmentOptions}
              disabled={isLoading || !departments.length}
              {...form.register("targetDepartmentId")}
            />

            <Select
              label="Prioridade"
              error={form.formState.errors.priority?.message}
              options={[
                { label: "Baixa", value: "LOW" },
                { label: "Media", value: "MEDIUM" },
                { label: "Alta", value: "HIGH" }
              ]}
              {...form.register("priority")}
            />

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-amber-700">
                <Clock3 size={14} />
                Prazo estimado (SLA)
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-700">{slaEstimate}</p>
              <p className="mt-1 text-xs text-amber-700/80">
                Estimativa visual com base na prioridade selecionada.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                <FileText size={14} />
                Resumo
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Chamado sera aberto com status inicial NEW para o departamento selecionado.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4 lg:px-8">
          <Button type="button" variant="ghost" className="border border-slate-200 bg-white">
            <TriangleAlert size={16} />
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !departments.length}>
            <SendHorizontal size={16} />
            {isLoading ? "Criando..." : "Abrir chamado"}
          </Button>
        </div>
      </div>
    </form>
  );
}
