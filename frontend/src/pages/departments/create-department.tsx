import { Bell, HelpCircle } from "lucide-react";
import { Navigate } from "react-router-dom";

import { CreateDepartmentForm } from "../../components/forms/create-department-form";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useAuth } from "../../hooks/use-auth";
import { useCreateDepartment } from "../../hooks/use-departments";
import { useUsers } from "../../hooks/use-users";
import { CreateDepartmentFormData } from "../../schemas/departments/create-department-schema";
import { getApiErrorMessage } from "../../services/api";

export function CreateDepartmentPage() {
  const { user } = useAuth();
  const createDepartmentMutation = useCreateDepartment();
  const usersQuery = useUsers({ includeInactive: true });

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const errorMessage = createDepartmentMutation.isError
    ? getApiErrorMessage(createDepartmentMutation.error)
    : null;

  async function handleCreateDepartment(data: CreateDepartmentFormData) {
    createDepartmentMutation.reset();
    await createDepartmentMutation.mutateAsync(data);
  }

  if (usersQuery.isLoading) {
    return <Loading />;
  }

  if (usersQuery.isError) {
    return <ErrorState message={getApiErrorMessage(usersQuery.error)} />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Novo departamento</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cadastro administrativo de departamentos para organizacao dos chamados.
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
        {errorMessage ? <ErrorState message={errorMessage} /> : null}
        {createDepartmentMutation.isSuccess ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Departamento criado com sucesso.
          </div>
        ) : null}

        <CreateDepartmentForm
          isLoading={createDepartmentMutation.isPending}
          managers={usersQuery.data?.users ?? []}
          onSubmit={handleCreateDepartment}
        />
      </Card>
    </div>
  );
}
