import { Building2, Edit3, PlusCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useChangeDepartmentStatus, useDepartments } from "../../hooks/use-departments";
import { getApiErrorMessage } from "../../services/api";

export function ListDepartmentsPage() {
  const departmentsQuery = useDepartments({ includeInactive: true });
  const changeDepartmentStatusMutation = useChangeDepartmentStatus();

  async function handleChangeStatus(departmentId: string, isActive: boolean) {
    await changeDepartmentStatusMutation.mutateAsync({ departmentId, isActive });
  }

  if (departmentsQuery.isLoading) {
    return <Loading />;
  }

  if (departmentsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(departmentsQuery.error)} />;
  }

  const departments = departmentsQuery.data?.departments ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Departamentos</h1>
          <p className="text-sm text-slate-500">Gestao administrativa completa dos departamentos.</p>
        </div>
        <Link to="/departments/new">
          <Button>
            <PlusCircle size={16} />
            Novo departamento
          </Button>
        </Link>
      </header>

      {changeDepartmentStatusMutation.isError ? (
        <ErrorState message={getApiErrorMessage(changeDepartmentStatusMutation.error)} />
      ) : null}

      {!departments.length ? (
        <EmptyState
          title="Nenhum departamento encontrado"
          description="Crie departamentos para distribuir chamados por area de destino."
        />
      ) : (
        <div className="space-y-3">
          {departments.map((department) => (
            <Card key={department.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{department.name}</h2>
                  <p className="text-xs text-slate-500">Gestor: {department.managerUserId ?? "Nao definido"}</p>
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    department.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <Building2 size={12} className="mr-1" />
                  {department.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <Link to={`/departments/${department.id}/edit`}>
                  <Button variant="secondary">
                    <Edit3 size={14} />
                    Editar
                  </Button>
                </Link>

                <Button
                  variant={department.isActive ? "danger" : "primary"}
                  disabled={changeDepartmentStatusMutation.isPending}
                  onClick={() => handleChangeStatus(department.id, !department.isActive)}
                >
                  {department.isActive ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                  {department.isActive ? "Inativar" : "Ativar"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
