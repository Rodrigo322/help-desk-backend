import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateUserSchema, UpdateUserFormData } from "../../schemas/users/update-user-schema";
import { Department } from "../../types/department";
import { User } from "../../types/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type EditUserFormProps = {
  isLoading: boolean;
  user: User;
  departments: Department[];
  onSubmit: (data: UpdateUserFormData) => Promise<void> | void;
};

export function EditUserForm({ isLoading, user, departments, onSubmit }: EditUserFormProps) {
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      departmentId: user.departmentId,
      role: user.role
    }
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      password: "",
      departmentId: user.departmentId,
      role: user.role
    });
  }, [form, user]);

  const departmentOptions = [
    { label: "Selecione o departamento", value: "" },
    ...departments.map((department) => ({
      label: `${department.name}${department.isActive ? "" : " (Inativo)"}`,
      value: department.id
    }))
  ];

  async function handleSubmit(data: UpdateUserFormData) {
    await onSubmit({
      ...data,
      password: data.password?.trim() ? data.password.trim() : undefined
    });
  }

  return (
    <form className="space-y-0" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 p-6 lg:border-r lg:border-slate-100 lg:p-8">
            <Input label="Nome completo" error={form.formState.errors.name?.message} {...form.register("name")} />
            <Input
              label="E-mail"
              type="email"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
            <Input
              label="Nova senha (opcional)"
              type="password"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />
          </div>

          <div className="space-y-6 bg-slate-50/80 p-6 lg:p-8">
            <Select
              label="Departamento"
              error={form.formState.errors.departmentId?.message}
              options={departmentOptions}
              disabled={isLoading || !departments.length}
              {...form.register("departmentId")}
            />
            <Select
              label="Perfil"
              error={form.formState.errors.role?.message}
              options={[
                { label: "Colaborador", value: "EMPLOYEE" },
                { label: "Gestor", value: "MANAGER" },
                { label: "Administrador", value: "ADMIN" }
              ]}
              {...form.register("role")}
            />

            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-brand-700">
                <ShieldCheck size={14} />
                Controle de acesso
              </p>
              <p className="mt-2 text-sm text-brand-700">
                Mantenha os dados atualizados para garantir atribuicao correta dos chamados.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 px-6 py-4 lg:px-8">
          <Button type="submit" disabled={isLoading || !departments.length}>
            <Save size={16} />
            {isLoading ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
