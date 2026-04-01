import { Outlet } from "react-router-dom";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden md:pl-72">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
