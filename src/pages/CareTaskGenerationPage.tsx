import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarClock, CheckCircle2, Clock3, RefreshCw, Save, Settings2, Sparkles, TimerReset } from "lucide-react";
import { getCareTaskGenerationSchedule, updateCareTaskGenerationSchedule } from "../features/admin/adminApi";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../lib/queryKeys";
import { formatDate } from "../lib/format";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ErrorState, LoadingRows } from "../components/ui/State";

export function CareTaskGenerationPage() {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const query = useQuery({ queryKey: queryKeys.careSchedule, queryFn: getCareTaskGenerationSchedule });
  const mutation = useMutation({
    mutationFn: updateCareTaskGenerationSchedule,
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.careSchedule });
    }
  });
  if (query.isLoading) return <LoadingRows rows={5} />;
  if (query.isError) return <ErrorState message="Care task schedule could not be loaded." onRetry={() => query.refetch()} />;
  const schedule = query.data;
  if (!schedule) return <ErrorState message="Care task schedule was empty." onRetry={() => query.refetch()} />;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    const value = time || schedule.dailyRunTime?.slice(0, 5) || "";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) { setError("Use a valid 24-hour HH:mm time, for example 06:30."); return; }
    mutation.mutate(`${value}:00`);
  };
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                <TimerReset className="h-3.5 w-3.5" strokeWidth={1.8} />
                Background job
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">Care task generation</h1>
              <p className="mt-2 text-sm leading-6 text-forest-900/62">Controls the daily care task generation and reminder schedule for plant care workflows.</p>
            </div>
            <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-white">
            <CardHeader className="border-b-0 pb-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-semibold text-forest-950"><Settings2 className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> {schedule.jobName || "Care task generation"}</h2>
                  <p className="mt-1 text-xs leading-5 text-forest-900/55">A calm system job that keeps plant care tasks current for users.</p>
                </div>
                <Badge tone="success"><CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} /> Scheduled</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <Info icon={Clock3} label="Daily run time" value={schedule.dailyRunTime || "unknown / needs backend confirmation"} />
              <Info icon={Sparkles} label="Time zone" value={schedule.timeZone || "unknown / needs backend confirmation"} />
              <Info icon={CalendarClock} label="Next run" value={formatDate(schedule.nextRunAt)} />
            </CardContent>
          </div>
        </Card>
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-gradient-to-br from-white to-sage-100/50">
            <CardHeader className="border-b-0 pb-2">
              <h2 className="flex items-center gap-2 font-semibold text-forest-950"><Save className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Update schedule</h2>
              <p className="mt-1 text-xs leading-5 text-forest-900/55">Enter a 24-hour time. The API receives HH:mm:ss.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submit}>
                <label className="block text-sm font-medium text-forest-950">
                  Daily run time
                  <Input className="mt-2 h-11 rounded-2xl bg-white" placeholder={schedule.dailyRunTime?.slice(0, 5) || "HH:mm"} value={time} onChange={(e) => setTime(e.target.value)} />
                </label>
                {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-700/10">{error}</p> : null}
                {saved && !error ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-700/10">Schedule saved.</p> : null}
                <Button className="w-full" disabled={mutation.isPending}><Save className="h-4 w-4" /> Save schedule</Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="rounded-2xl bg-sage-100/70 p-4 ring-1 ring-forest-900/[0.03]"><p className="flex items-center gap-2 text-xs font-semibold text-forest-900/48"><Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> {label}</p><p className="mt-2 break-words text-sm font-semibold text-forest-950">{value}</p></div>;
}
