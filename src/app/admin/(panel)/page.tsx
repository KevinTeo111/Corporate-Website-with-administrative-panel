import Link from "next/link";
import { Building2, Users, Inbox, MousePointerClick, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageTitle, Badge } from "@/components/admin/ui";
import { formatDateTime, leadStatusLabel, roomModeLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const since = new Date(); since.setDate(since.getDate() - 56);
  const [companies, inactiveCompanies, professionals, newLeads, adClicks, recentLeads, recentLogs, leadRows, rooms] = await Promise.all([
    prisma.company.count({ where: { active: true } }),
    prisma.company.count({ where: { active: false } }),
    prisma.professional.count({ where: { active: true } }),
    prisma.roomLead.count({ where: { status: "NEW" } }),
    prisma.ad.aggregate({ _sum: { clicks: true } }),
    prisma.roomLead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.roomLead.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.room.findMany({ select: { available: true } }),
  ]);

  // Leads per week, last 8 weeks (single series, single hue)
  const weeks = Array.from({ length: 8 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (7 - i) * 7); return d; });
  const buckets = weeks.map((start, i) => {
    const end = i < 7 ? weeks[i + 1] : new Date(8.64e15);
    return { label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(start), count: leadRows.filter((l) => l.createdAt >= start && l.createdAt < end).length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.count));

  const tiles = [
    { icon: Building2, label: "Empresas ativas", value: companies, sub: inactiveCompanies ? `${inactiveCompanies} inativa${inactiveCompanies > 1 ? "s" : ""}` : "todas ativas", href: "/admin/empresas" },
    { icon: Users, label: "Profissionais ativos", value: professionals, sub: "vínculos com empresas", href: "/admin/profissionais" },
    { icon: Inbox, label: "Interessados novos", value: newLeads, sub: `${rooms.filter((r) => r.available).length} de ${rooms.length} salas disponíveis`, href: "/admin/interessados" },
    { icon: MousePointerClick, label: "Cliques em anúncios", value: adClicks._sum.clicks ?? 0, sub: "acumulado", href: "/admin/publicidade" },
  ];

  return (
    <>
      <PageTitle title="Painel" description="Resumo do diretório, das salas e das ações recentes." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-pine-50 text-pine-700"><t.icon className="h-4 w-4" /></span>
              <ArrowRight className="h-4 w-4 text-ink-300" />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-ink-900">{t.value}</p>
            <p className="text-sm font-medium text-ink-700">{t.label}</p>
            <p className="text-xs text-ink-500">{t.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="card p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-sans text-base font-bold text-ink-900">Interessados em salas por semana</h2>
            <span className="text-xs text-ink-500">últimas 8 semanas</span>
          </div>
          <div className="flex items-end gap-2" role="img" aria-label={`Interessados por semana: ${buckets.map((b) => `${b.label}: ${b.count}`).join(", ")}`}>
            {buckets.map((b) => (
              <div key={b.label} className="group flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-ink-700 opacity-0 transition group-hover:opacity-100">{b.count}</span>
                <div className="flex h-28 w-full items-end">
                  <div className="w-full rounded-t-[4px] bg-pine-500 transition-colors group-hover:bg-pine-700" style={{ height: `${Math.max(3, (b.count / max) * 100)}%` }} title={`${b.label}: ${b.count}`} />
                </div>
                <span className="text-[10px] text-ink-500">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-sans text-base font-bold text-ink-900">Últimos interessados</h2>
            <Link href="/admin/interessados" className="text-xs font-semibold text-pine-700 hover:underline">Ver todos</Link>
          </div>
          <ul className="divide-y divide-sand-200">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{l.name}</p>
                  <p className="truncate text-xs text-ink-500">{roomModeLabel[l.mode]} · {l.activityArea ?? "sem área"} · {formatDateTime(l.createdAt)}</p>
                </div>
                <Badge tone={l.status === "NEW" ? "info" : l.status === "CONTACTED" ? "warn" : "neutral"}>{leadStatusLabel[l.status]}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card mt-4 p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-sans text-base font-bold text-ink-900">Ações recentes</h2>
          <Link href="/admin/historico" className="text-xs font-semibold text-pine-700 hover:underline">Histórico completo</Link>
        </div>
        <ul className="divide-y divide-sand-200">
          {recentLogs.map((l) => (
            <li key={l.id} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-900"><span className="font-semibold">{l.userName}</span> <span className="text-ink-500">{l.detail ?? `${l.action} ${l.entity}`}</span></p>
              <span className="text-xs text-ink-500">{formatDateTime(l.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
