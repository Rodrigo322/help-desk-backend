import { Bell, HelpCircle } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import { EditUserForm } from "../../components/forms/edit-user-form";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useAuth } from "../../hooks/use-auth";
import { useDepartments } from "../../hooks/use-departments";
import { useUpdateUser, useUserById } from "../../hooks/use-users";
import { UpdateUserFormData } from "../../schemas/users/update-user-schema";
import { getApiErrorMessage } from "../../services/api";

export function EditUserPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const userId = params.id ?? "";

  const userQuery = useUserById(userId);
  const departmentsQuery = useDepartments({ includeInactive: true });
  const updateUserMutation = useUpdateUser(userId);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const errorMessage = updateUserMutation.isError
    ? getApiErrorMessage(updateUserMutation.error)
    : null;

  async function handleUpdateUser(data: UpdateUserFormData) {
    updateUserMutation.reset();
    await updateUserMutation.mutateAsync(data);
  }

  if (userQuery.isLoading || departmentsQuery.isLoading) {
    return <Loading />;
  }

  if (userQuery.isError) {
    return <ErrorState message={getApiErrorMessage(userQuery.error)} />;
  }

  if (departmentsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(departmentsQuery.error)} />;
  }

  const editableUser = userQuery.data?.user;

  if (!editableUser) {
    return <ErrorState message="Usuario nao encontrado." />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editar usuario</h1>
          <p className="mt-1 text-sm text-slate-500">Atualize perfil, departamento e credenciais.</p>
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
        {updateUserMutation.isSuccess ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Usuario atualizado com sucesso.
          </div>
        ) : null}

        <EditUserForm
          isLoading={updateUserMutation.isPending}
          user={editableUser}
          departments={departmentsQuery.data?.departments ?? []}
          onSubmit={handleUpdateUser}
        />
      </Card>
    </div>
  );
}
