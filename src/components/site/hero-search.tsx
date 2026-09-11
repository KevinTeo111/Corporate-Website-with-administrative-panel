"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

const suggestions = ["Cardiologia", "Odontologia", "Exames", "Pediatria", "Fisioterapia", "Psicologia"];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"empresas" | "profissionais">("empresas");

  const go = (term: string) => router.push(`/${scope}?busca=${encodeURIComponent(term)}`);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); go(q.trim()); }}
      className="rounded-2xl bg-white p-2 shadow-lift ring-1 ring-sand-300"
    >
      <div className="flex items-center gap-1 px-1 pt-1">
        {(["empresas", "profissionais"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setScope(s)} className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${scope === s ? "bg-pine-800 text-white" : "text-ink-500 hover:bg-sand-100"}`}>{s}</button>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Search className="ml-3 h-5 w-5 shrink-0 text-ink-300" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={scope === "empresas" ? "Clínica, especialidade ou serviço" : "Nome do profissional ou especialidade"}
          className="h-12 w-full bg-transparent text-base text-ink-900 placeholder:text-ink-300 focus:outline-none"
          aria-label="Buscar"
        />
        <button type="submit" className="btn-accent h-11 shrink-0 px-4" aria-label="Buscar">
          <span className="hidden sm:inline">Buscar</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="scrollbar-none mt-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => go(s)} className="chip shrink-0 border-transparent bg-sand-100">{s}</button>
        ))}
      </div>
    </form>
  );
}
