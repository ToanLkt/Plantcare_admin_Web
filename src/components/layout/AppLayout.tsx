import { Bell, BriefcaseBusiness, ChevronDown, CreditCard, LayoutDashboard, Leaf, Search, Settings, Sparkles, Users, Workflow } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../features/auth/AuthProvider";

const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
  },
  {
    label: "Operations",
    items: [
      { to: "/users", label: "Users", icon: Users },
      { to: "/payments", label: "Payments", icon: CreditCard },
      { to: "/subscription-plans", label: "Plans", icon: BriefcaseBusiness },
      { to: "/background-jobs/care-task-generation", label: "Care jobs", icon: Workflow }
    ]
  },
  {
    label: "Workspace",
    items: [{ to: "/settings", label: "Settings", icon: Settings }]
  }
];

export function AppLayout() {
  const { user } = useAuth();
  const initials = (user?.fullName || user?.email || "A").slice(0, 1).toUpperCase();
  return (
    <div className="surface-grid min-h-[100dvh] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="border-r border-sage-200/80 bg-cream/92 p-4 lg:sticky lg:top-0 lg:h-[100dvh] lg:w-[18rem]">
        <div className="flex h-full flex-col">
          <div className="rounded-[1.65rem] bg-white/88 p-2 shadow-elevated ring-1 ring-forest-900/[0.06]">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 p-4 text-white">
              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-mint/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-forest-950 shadow-[inset_0_1px_0_rgba(255,255,255,.65)]">
                  <Leaf className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[-0.01em]">PlantCare Hub</p>
                  <p className="mt-0.5 text-xs text-white/68">Admin console</p>
                </div>
              </div>
              <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/10 p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-white/76">
                  <Sparkles className="h-3.5 w-3.5 text-mint" strokeWidth={1.8} />
                  Live operations
                </div>
                <p className="mt-1 text-[11px] leading-5 text-white/58">Monitoring accounts, plans, revenue, and scheduled care jobs.</p>
              </div>
            </div>
          </div>
          <nav className="mt-7 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-900/40">{group.label}</p>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                          isActive
                            ? "bg-white text-forest-950 shadow-card ring-1 ring-forest-900/[0.06]"
                            : "text-forest-900/62 hover:bg-white/70 hover:text-forest-950 hover:shadow-card"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={cn("grid h-8 w-8 place-items-center rounded-xl transition", isActive ? "bg-mint text-forest-900" : "bg-sage-100 text-forest-900/58 group-hover:bg-mint group-hover:text-forest-900")}>
                            <item.icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {isActive ? <span className="h-2 w-2 rounded-full bg-forest-800" /> : null}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-[1.35rem] border border-sage-200/70 bg-white/74 p-4 shadow-card">
            <p className="text-xs font-semibold text-forest-950">Production API</p>
            <p className="mt-1 truncate text-[11px] text-forest-900/55">api.plantcarehub.id.vn</p>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-sage-200/70 bg-cream/82 px-5 py-4 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
            <div className="relative hidden min-w-0 max-w-2xl flex-1 md:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/42" strokeWidth={1.8} />
              <input className="focus-ring h-11 w-full rounded-2xl border border-white/85 bg-white/88 pl-11 pr-28 text-sm text-forest-950 shadow-card ring-1 ring-forest-900/[0.03] placeholder:text-forest-900/38" placeholder="Search users, payments, plans" />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg bg-sage-100 px-2 py-1 text-[11px] font-semibold text-forest-900/45 lg:block">Admin</span>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-3">
              <button className="focus-ring relative grid h-11 w-11 place-items-center rounded-2xl border border-white/85 bg-white/88 text-forest-900 shadow-card ring-1 ring-forest-900/[0.03] transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:bg-mint">
                <Bell className="h-4 w-4" strokeWidth={1.8} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-forest-800 ring-2 ring-white" />
              </button>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/85 bg-white/88 py-1.5 pl-1.5 pr-3 shadow-card ring-1 ring-forest-900/[0.03]">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-900 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16)]">
                  {initials}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-[11rem] truncate text-sm font-semibold leading-4 text-forest-950">{user?.fullName || "Admin"}</p>
                  <p className="max-w-[11rem] truncate text-xs text-forest-900/55">{user?.email}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 shrink-0 text-forest-900/42 sm:block" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-5 lg:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
