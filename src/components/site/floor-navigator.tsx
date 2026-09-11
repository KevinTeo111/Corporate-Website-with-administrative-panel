"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { cn, floorLabel } from "@/lib/utils";

type FloorEntry = {
  floor: number;
  companies: { id: string; name: string; slug: string; room: string; category: { name: string; kind: "COMPANY" | "SERVICE" } }[];
};

export function FloorNavigator({ floors }: { floors: FloorEntry[] }) {
  const [selected, setSelected] = useState(floors[0]?.floor ?? 0);
  const current = floors.find((f) => f.floor === selected);
  const max = Math.max(...floors.map((f) => f.companies.length), 1);

  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[minmax(0,300px)_1fr]">
      {/* Building */}
      <div className="border-b border-sand-200 bg-gradient-to-b from-pine-50 to-sand-50 p-4 lg:border-b-0 lg:border-r">
        <p className="mb-3 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wide text-ink-500"><Building2 className="h-3.5 w-3.5" /> Escolha um andar</p>
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Andares">
          {floors.map((f) => {
            const active = f.floor === selected;
            const width = 40 + (f.companies.length / max) * 60;
            return (
              <button
                key={f.floor}
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(f.floor)}
                className={cn(
                  "group relative flex shrink-0 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all lg:w-full",
                  active ? "bg-pine-800 text-white shadow-soft" : "bg-white text-ink-700 ring-1 ring-sand-300 hover:ring-pine-300",
                )}
              >
                <span className="font-semibold whitespace-nowrap">{floorLabel(f.floor)}</span>
                <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-black/10 lg:block">
                  <span className={cn("block h-full rounded-full transition-all", active ? "bg-coral-400" : "bg-pine-300 group-hover:bg-pine-400")} style={{ width: `${width}%` }} />
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", active ? "bg-white/15" : "bg-sand-100 text-ink-500")}>{f.companies.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floor contents */}
      <div className="p-5 sm:p-6">
        {current && (
          <div key={current.floor} className="animate-fade-up">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-2xl font-semibold text-pine-900">{floorLabel(current.floor)}</h3>
              <Link href={`/empresas?andar=${current.floor}`} className="inline-flex items-center gap-1 text-sm font-semibold text-pine-700 hover:underline">Ver no diretório <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {current.companies.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.category.kind === "SERVICE" ? "servicos" : "empresas"}?busca=${encodeURIComponent(c.name)}`} className="flex items-center gap-3 rounded-xl border border-sand-200 px-3.5 py-3 transition hover:border-pine-300 hover:bg-pine-50/40">
                    <span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-sand-100 font-display text-sm font-semibold text-pine-800">{c.room}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink-900">{c.name}</span>
                      <span className="block truncate text-xs text-ink-500">{c.category.name}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
