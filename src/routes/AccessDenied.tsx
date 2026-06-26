import { LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/AuthProvider";

export function AccessDenied() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-[70dvh] items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-2xl border border-sage-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold text-forest-800">Access denied</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest-950">Admin permission is required</h1>
        <p className="mt-3 text-sm leading-6 text-forest-900/70">
          You are signed in as {user?.email || "a non-admin account"} with role {user?.role || "Unknown"}.
        </p>
        <Button className="mt-6" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </section>
    </div>
  );
}
