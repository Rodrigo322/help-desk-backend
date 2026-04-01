import { Bell, LogOut } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";
import { useDepartments } from "../../hooks/use-departments";
import { Button } from "../ui/button";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const departmentsQuery = useDepartments();

  const roleLabel = useMemo(() => {
    if (!user) {
      return "-";
    }

    if (user.role === "ADMIN") {
      return "Administrador";
    }

    if (user.role === "MANAGER") {
      return "Gestor";
    }

    return "Colaborador";
  }, [user]);

  const departmentLabel = useMemo(() => {
    if (!user) {
      return "-";
    }

    const department = departmentsQuery.data?.departments.find(
      (item) => item.id === user.departmentId
    );

    return department?.name ?? user.departmentId;
  }, [departmentsQuery.data?.departments, user]);

  function handleSignOut() {
    signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Sistema de chamados
        </p>
        <p className="text-sm font-semibold text-slate-800">{user?.name ?? "Usuario"}</p>
        <p className="text-xs text-slate-500">
          Perfil: {roleLabel} | Departamento: {departmentLabel}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
          type="button"
          aria-label="Notificacoes"
        >
          <Bell size={16} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <Button variant="ghost" onClick={handleSignOut} className="border border-slate-200 bg-white">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}
