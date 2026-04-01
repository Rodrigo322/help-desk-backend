import {
  Bell,
  Building2,
  LayoutDashboard,
  PlusCircle,
  Ticket,
  UserCircle2,
  Users
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

export function Sidebar() {
  const { user } = useAuth();
  const showNotifications = user?.role === "MANAGER" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="w-full bg-[var(--sidebar-bg)] md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-72 md:overflow-y-auto">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500 text-[var(--sidebar-bg)]">
              <Ticket size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-white">JUSTI TRATORES</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Painel interno</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          <NavLink to="/" className={linkClass} end>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/tickets" className={linkClass} end>
            <Ticket size={16} />
            Chamados
          </NavLink>
          <NavLink to="/tickets/new" className={linkClass}>
            <PlusCircle size={16} />
            Novo chamado
          </NavLink>
          {showNotifications ? (
            <NavLink to="/notifications" className={linkClass}>
              <Bell size={16} />
              Notificacoes
            </NavLink>
          ) : null}

          {isAdmin ? (
            <>
              <p className="px-4 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Administracao
              </p>
              <NavLink to="/users" className={linkClass} end>
                <Users size={16} />
                Usuarios
              </NavLink>
              <NavLink to="/users/new" className={linkClass}>
                <PlusCircle size={16} />
                Novo usuario
              </NavLink>
              <NavLink to="/departments" className={linkClass} end>
                <Building2 size={16} />
                Departamentos
              </NavLink>
              <NavLink to="/departments/new" className={linkClass}>
                <PlusCircle size={16} />
                Novo departamento
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="border-t border-white/10 bg-[var(--sidebar-bg-strong)]/40 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
              <UserCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Usuario"}</p>
              <p className="truncate text-[11px] uppercase tracking-[0.12em] text-white/60">
                {user?.role ?? "EMPLOYEE"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
