import { Outlet } from "react-router-dom";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

