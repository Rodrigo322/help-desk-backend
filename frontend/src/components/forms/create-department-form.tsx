import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, FolderPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  CreateDepartmentFormData,
  createDepartmentSchema
} from "../../schemas/departments/create-department-schema";
import { User } from "../../types/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type CreateDepartmentFormProps = {
  isLoading: boolean;
  managers: User[];
  onSubmit: (data: CreateDepartmentFormData) => Promise<void> | void;
};

export function CreateDepartmentForm({ isLoading, managers, onSubmit }: CreateDepartmentFormProps) {
  const form = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      managerUserId: ""
    }
  });

  async function handleSubmit(data: CreateDepartmentFormData) {
    await onSubmit(data);
    form.reset({
      name: "",
      managerUserId: ""
    });
  }

  const managerOptions = [
    { label: "Sem gestor definido", value: "" },
    ...managers
      .filter((manager) => manager.isActive && (manager.role === "MANAGER" || manager.role === "ADMIN"))
      .map((manager) => ({
        label: `${manager.name} (${manager.role === "ADMIN" ? "Administrador" : "Gestor"})`,
        value: manager.id
      }))
  ];

  return (
    <form className="space-y-0" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 p-6 lg:border-r lg:border-slate-100 lg:p-8">
            <Input
              label="Nome do departamento"
              placeholder="Ex: Tecnologia da Informacao"
              error={form.formState.errors.name?.message}
              {...form.register("name")}
            />

            <Select
              label="Gestor (opcional)"
              error={form.formState.errors.managerUserId?.message}
              options={managerOptions}
              {...form.register("managerUserId")}
            />
          </div>

          <div className="space-y-6 bg-slate-50/80 p-6 lg:p-8">
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-brand-700">
                <Building2 size={14} />
                Estrutura organizacional
              </p>
              <p className="mt-2 text-sm text-brand-700">
                Um departamento pode ter varios usuarios e receber chamados de varios setores.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-4 lg:px-8">
          <Button type="submit" disabled={isLoading}>
            <FolderPlus size={16} />
            {isLoading ? "Criando..." : "Criar departamento"}
          </Button>
        </div>
      </div>
    </form>
  );
}
