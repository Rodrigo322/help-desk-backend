import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-brand-100 text-brand-700" : "text-slate-700 hover:bg-slate-100"
  }`;

export function Sidebar() {
  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 md:w-64">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-900">Sistema de Chamados</h1>
        <p className="text-xs text-slate-500">Área autenticada</p>
      </div>

      <nav className="space-y-1">
        <NavLink to="/" className={linkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/tickets" className={linkClass} end>
          Tickets
        </NavLink>
        <NavLink to="/tickets/new" className={linkClass}>
          Novo chamado
        </NavLink>
      </nav>
    </aside>
  );
}
