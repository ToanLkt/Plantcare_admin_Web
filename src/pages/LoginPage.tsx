import { FormEvent, useState } from "react";
import { Leaf, Loader2, ShieldCheck, Sprout } from "lucide-react";
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
    <main className="surface-grid min-h-[100dvh] overflow-x-hidden bg-cream px-4 py-4 lg:flex lg:h-[100dvh] lg:items-center lg:overflow-hidden lg:px-6">
      <section className="mx-auto grid w-full max-w-[1320px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/72 p-2 shadow-elevated ring-1 ring-forest-900/[0.04] lg:h-[calc(100dvh-2rem)] lg:max-h-[760px] lg:min-h-0 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="flex min-h-0 flex-col justify-center rounded-[1.55rem] bg-gradient-to-br from-white via-white to-sage-100/50 px-6 py-8 sm:px-10 lg:px-12 lg:py-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-forest-950 shadow-card">
              <Leaf className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-forest-950">PlantCare Hub</p>
              <p className="text-xs text-forest-900/55">Admin console</p>
            </div>
          </div>

          <div className="max-w-md">
            <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              Secure staff access
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-forest-950 sm:text-4xl">Admin login</h1>
            <p className="mt-3 text-sm leading-6 text-forest-900/62">Sign in to manage users, payments, subscription plans, and scheduled care operations.</p>
          </div>

          <form className="mt-6 max-w-md space-y-3.5" onSubmit={onSubmit}>
            <label className="block text-sm font-semibold text-forest-950">
              Email
              <Input className="mt-2 h-11 rounded-2xl bg-white shadow-card" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <label className="block text-sm font-semibold text-forest-950">
              Password
              <Input className="mt-2 h-11 rounded-2xl bg-white shadow-card" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </label>
            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            <Button className="h-11 w-full rounded-2xl" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
            <p className="text-center text-xs leading-5 text-forest-900/48">For admin access issues, contact the PlantCare Hub operations owner.</p>
          </form>
        </div>

        <aside className="relative hidden min-h-0 overflow-hidden rounded-[1.55rem] lg:block lg:h-full">
          <img src="/onboarding3.jpg" alt="PlantCare Hub onboarding visual" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950/18 via-transparent to-forest-900/34" />
          <div className="absolute inset-x-5 bottom-5 rounded-[1.35rem] border border-white/40 bg-white/68 p-4 shadow-elevated backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-mint text-forest-950">
                <Sprout className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-forest-950">Manage PlantCare operations with clarity</h2>
                <p className="mt-1 text-sm leading-5 text-forest-900/68">Monitor users, plans, payments, and scheduled care jobs from one focused console.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
