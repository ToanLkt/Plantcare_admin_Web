import { FormEvent, useState } from "react";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../features/auth/AuthProvider";
import { getErrorMessage } from "../lib/apiClient";
import { AccessDenied } from "../routes/AccessDenied";

export function LoginPage() {
  const { login, accessDenied } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err, err instanceof Error ? err.message : "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (accessDenied) return <AccessDenied />;

  return (
    <main className="grid min-h-[100dvh] place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-sage-200 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest-950">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-forest-950">Admin login</h1>
            <p className="text-sm text-forest-900/65">PlantCare Hub operations</p>
          </div>
        </div>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-forest-950">
            Email
            <Input className="mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="block text-sm font-medium text-forest-950">
            Password
            <Input className="mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
