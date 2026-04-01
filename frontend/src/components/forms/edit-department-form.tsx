import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  updateDepartmentSchema,
  UpdateDepartmentFormData
} from "../../schemas/departments/update-department-schema";
import { Department } from "../../types/department";
import { User } from "../../types/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type EditDepartmentFormProps = {
  isLoading: boolean;
  department: Department;
  managers: User[];
  onSubmit: (data: UpdateDepartmentFormData) => Promise<void> | void;
};

export function EditDepartmentForm({ isLoading, department, managers, onSubmit }: EditDepartmentFormProps) {
  const form = useForm<UpdateDepartmentFormData>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: department.name,
      managerUserId: department.managerUserId ?? ""
    }
  });

  useEffect(() => {
    form.reset({
      name: department.name,
      managerUserId: department.managerUserId ?? ""
    });
  }, [department, form]);

  async function handleSubmit(data: UpdateDepartmentFormData) {
    await onSubmit(data);
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
                Governanca
              </p>
              <p className="mt-2 text-sm text-brand-700">
                Atualize o gestor e o nome do departamento sem perder historico dos chamados.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-4 lg:px-8">
          <Button type="submit" disabled={isLoading}>
            <Save size={16} />
            {isLoading ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
