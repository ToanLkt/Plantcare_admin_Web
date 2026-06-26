import { Globe2, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../features/auth/AuthProvider";
import { config } from "../lib/config";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RoleBadge } from "../components/ui/Badge";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const displayName = user?.fullName || user?.name || "Admin";
  const email = user?.email || "No email available";
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
              Admin session
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">Settings</h1>
            <p className="mt-2 text-sm leading-6 text-forest-900/62">Manage this admin console session, review environment details, and sign out when finished.</p>
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-white">
            <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Admin profile</h2></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-[1.35rem] bg-forest-900 text-2xl font-bold text-white shadow-elevated">{displayName.slice(0, 1).toUpperCase()}</div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold tracking-[-0.02em] text-forest-950">{displayName}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-forest-900/60"><Mail className="h-4 w-4" strokeWidth={1.8} /> {email}</p>
                </div>
                <RoleBadge role={user?.role} />
              </div>
              {!user ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-700/10">Current user data is unavailable. The session may still be restoring or the backend did not return profile details.</p> : null}
            </CardContent>
          </div>
        </Card>
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-gradient-to-br from-white to-sage-100/50">
            <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Session security</h2></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-forest-900/62">This controls the current browser session for the PlantCare Hub admin console. Logout clears the stored MVP session token.</p>
              <Button variant="secondary" className="w-full justify-center" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button>
            </CardContent>
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden p-1.5">
        <div className="rounded-[1.05rem] bg-white">
          <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><Globe2 className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Environment</h2></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Info label="App name" value={config.appName} />
            <Info label="API base URL" value={config.apiBaseUrl} />
            <Info label="Token storage" value="localStorage for MVP persistence" />
            <Info label="Console role" value={user?.role || "Unknown"} />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-sage-100/70 p-4 ring-1 ring-forest-900/[0.03]"><p className="text-xs font-semibold text-forest-900/48">{label}</p><p className="mt-2 break-words text-sm font-semibold text-forest-950">{value}</p></div>;
}
