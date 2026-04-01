import { Edit3, PlusCircle, Shield, UserX, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useUsers, useChangeUserStatus } from "../../hooks/use-users";
import { getApiErrorMessage } from "../../services/api";

const roleLabel: Record<string, string> = {
  EMPLOYEE: "Colaborador",
  MANAGER: "Gestor",
  ADMIN: "Administrador"
};

export function ListUsersPage() {
  const usersQuery = useUsers({ includeInactive: true });
  const changeStatusMutation = useChangeUserStatus();

  async function handleChangeStatus(userId: string, isActive: boolean) {
    await changeStatusMutation.mutateAsync({ userId, isActive });
  }

  if (usersQuery.isLoading) {
    return <Loading />;
  }

  if (usersQuery.isError) {
    return <ErrorState message={getApiErrorMessage(usersQuery.error)} />;
  }

  const users = usersQuery.data?.users ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">Gestao completa de contas, perfis e status.</p>
        </div>
        <Link to="/users/new">
          <Button>
            <PlusCircle size={16} />
            Novo usuario
          </Button>
        </Link>
      </header>

      {changeStatusMutation.isError ? (
        <ErrorState message={getApiErrorMessage(changeStatusMutation.error)} />
      ) : null}

      {!users.length ? (
        <EmptyState
          title="Nenhum usuario encontrado"
          description="Crie o primeiro usuario para iniciar a operacao do sistema."
        />
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-500">Departamento: {user.departmentName ?? user.departmentId}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {user.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    <Shield size={12} className="mr-1" />
                    {roleLabel[user.role] ?? user.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <Link to={`/users/${user.id}/edit`}>
                  <Button variant="secondary">
                    <Edit3 size={14} />
                    Editar
                  </Button>
                </Link>

                <Button
                  variant={user.isActive ? "danger" : "primary"}
                  disabled={changeStatusMutation.isPending}
                  onClick={() => handleChangeStatus(user.id, !user.isActive)}
                >
                  {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                  {user.isActive ? "Inativar" : "Ativar"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
