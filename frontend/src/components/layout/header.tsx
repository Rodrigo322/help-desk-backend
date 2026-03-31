import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Navegação principal</p>
        <p className="text-sm font-semibold text-slate-800">{user?.name ?? "Usuário"}</p>
      </div>

      <Button variant="ghost" onClick={handleSignOut}>
        Logout
      </Button>
    </header>
  );
}

