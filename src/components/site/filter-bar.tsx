"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };
export type FilterDef = { param: string; label: string; options: FilterOption[]; mode?: "chips" | "select" };

export function FilterBar({ searchParam = "busca", placeholder, filters, total, noun }: { searchParam?: string; placeholder: string; filters: FilterDef[]; total: number; noun: [string, string] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get(searchParam) ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("pagina");
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  useEffect(() => {
    if (q === (params.get(searchParam) ?? "")) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setParam(searchParam, q.trim() || null), 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  const activeCount = filters.filter((f) => params.get(f.param)).length + (params.get(searchParam) ? 1 : 0);

  return (
    <div className="card sticky top-[4.5rem] z-30 p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="input pl-10 pr-10" />
          {pending ? (
            <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-pine-500" />
          ) : q ? (
            <button type="button" aria-label="Limpar busca" onClick={() => setQ("")} className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full hover:bg-sand-100"><X className="h-3.5 w-3.5" /></button>
          ) : null}
        </label>

        {filters.filter((f) => f.mode === "select").map((f) => (
          <label key={f.param} className="flex items-center gap-2 text-sm">
            <span className="sr-only">{f.label}</span>
            <select value={params.get(f.param) ?? ""} onChange={(e) => setParam(f.param, e.target.value || null)} className="input min-w-44 cursor-pointer lg:w-auto">
              <option value="">{f.label}: todos</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        ))}

        <div className="flex items-center justify-between gap-3 text-xs text-ink-500 lg:justify-end">
          <span className="inline-flex items-center gap-1.5"><SlidersHorizontal className="h-3.5 w-3.5" />{total} {total === 1 ? noun[0] : noun[1]}</span>
          {activeCount > 0 && (
            <button type="button" onClick={() => { setQ(""); start(() => router.replace(pathname, { scroll: false })); }} className="font-semibold text-coral-600 hover:underline">Limpar filtros</button>
          )}
        </div>
      </div>

      {filters.filter((f) => f.mode !== "select").map((f) => {
        const current = params.get(f.param);
        return (
          <div key={f.param} className="scrollbar-none mt-3 flex gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label={f.label}>
            <button type="button" onClick={() => setParam(f.param, null)} className={cn("chip shrink-0", !current && "chip-active")}>Todas</button>
            {f.options.map((o) => (
              <button key={o.value} type="button" onClick={() => setParam(f.param, current === o.value ? null : o.value)} className={cn("chip shrink-0", current === o.value && "chip-active")}>{o.label}</button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
