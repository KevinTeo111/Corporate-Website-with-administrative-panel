"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function LeadFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`);
  };
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="text-xs font-semibold text-ink-500">Status
        <select value={params.get("status") ?? ""} onChange={(e) => set("status", e.target.value)} className="input mt-1 w-40">
          <option value="">Todos</option><option value="NEW">Novo</option><option value="CONTACTED">Contatado</option><option value="CLOSED">Encerrado</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-ink-500">Modalidade
        <select value={params.get("modalidade") ?? ""} onChange={(e) => set("modalidade", e.target.value)} className="input mt-1 w-44">
          <option value="">Todas</option><option value="RENT">Locação</option><option value="SALE">Compra</option><option value="BOTH">Locação ou compra</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-ink-500">De<input type="date" value={params.get("de") ?? ""} onChange={(e) => set("de", e.target.value)} className="input mt-1 w-40" /></label>
      <label className="text-xs font-semibold text-ink-500">Até<input type="date" value={params.get("ate") ?? ""} onChange={(e) => set("ate", e.target.value)} className="input mt-1 w-40" /></label>
      {params.toString() && <button type="button" onClick={() => router.replace(pathname)} className="btn-ghost btn-sm">Limpar</button>}
    </div>
  );
}
