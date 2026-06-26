import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/AuthProvider";

export function NotFound() {
  const { token } = useAuth();
  return (
    <div className="flex min-h-[60dvh] items-center justify-center p-6">
      <section className="max-w-lg rounded-2xl border border-sage-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-medium text-forest-800">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-forest-950">Page not found</h1>
        <p className="mt-3 text-sm text-forest-900/70">This admin route is not available.</p>
        <Button asChild className="mt-6">
          <Link to={token ? "/dashboard" : "/login"}>{token ? "Back to dashboard" : "Back to login"}</Link>
        </Button>
      </section>
    </div>
  );
}
