"use client";

import { useActionState, useState, useTransition } from "react";
import { Download, Upload, CheckCircle2, AlertTriangle, XCircle, CopyX, FileCheck2 } from "lucide-react";
import { previewImport, confirmImport } from "@/lib/actions/admin";
import type { ImportKind } from "@/lib/import";
import { cn } from "@/lib/utils";

type Result = { inserted: number; skipped: number; failures: { line: number; message: string }[] };

export function ImportWizard() {
  const [kind, setKind] = useState<ImportKind>("empresas");
  const [state, action, pending] = useActionState(previewImport, null);
  const [result, setResult] = useState<Result | null>(null);
  const [confirming, start] = useTransition();
  const preview = state && "rows" in state ? state : null;
  const error = state && "error" in state ? state.error : null;

  const steps = ["Modelo", "Envio", "Prévia e validação", "Confirmação", "Relatório"];
  const current = result ? 4 : preview ? 2 : 1;

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-xs font-semibold">
        {steps.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 rounded-full px-3 py-1.5", i < current ? "bg-pine-100 text-pine-800" : i === current ? "bg-pine-800 text-white" : "bg-sand-100 text-ink-500")}>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/30 text-[10px]">{i + 1}</span>{s}
          </li>
        ))}
      </ol>

      {!preview && !result && (
        <form action={action} className="card grid gap-6 p-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label">1. Tipo de registro</p>
            <div className="flex gap-2">
              {(["empresas", "profissionais"] as ImportKind[]).map((k) => (
                <label key={k} className={cn("flex-1 cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition", kind === k ? "border-pine-700 bg-pine-50 text-pine-900" : "border-sand-300 text-ink-700 hover:border-pine-300")}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />{k}
                </label>
              ))}
            </div>
            <a href={`/api/admin/importacao/modelo?kind=${kind}`} className="btn-ghost btn-sm mt-4"><Download className="h-3.5 w-3.5" /> Baixar modelo de {kind}</a>
            <p className="mt-3 text-xs text-ink-500">
              Vínculos usam identificadores: <span className="font-mono">categoria</span> pelo slug e, em profissionais, <span className="font-mono">empresas</span> pelo <span className="font-mono">id_externo</span> de cada empresa, separados por ponto e vírgula.
            </p>
          </div>
          <div>
            <p className="label">2. Planilha preenchida (.xlsx ou .csv)</p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sand-300 px-4 py-8 text-center text-sm text-ink-500 transition hover:border-pine-400 hover:bg-pine-50/40">
              <Upload className="h-6 w-6 text-pine-600" />
              <span>Clique para escolher o arquivo</span>
              <input type="file" name="file" accept=".xlsx,.xls,.csv" required className="text-xs" />
            </label>
            {error && <p className="mt-3 rounded-lg bg-coral-50 p-3 text-sm text-coral-700" role="alert">{error}</p>}
            <button type="submit" disabled={pending} className="btn-primary mt-4">{pending ? "Lendo planilha…" : "Gerar prévia"}</button>
          </div>
        </form>
      )}

      {preview && !result && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-5">
            <Stat icon={FileCheck2} label="Linhas" value={preview.summary.total} />
            <Stat icon={CheckCircle2} label="Prontas" value={preview.summary.ok} tone="text-pine-700" />
            <Stat icon={AlertTriangle} label="Com aviso" value={preview.summary.warnings} tone="text-amber-700" />
            <Stat icon={XCircle} label="Com erro" value={preview.summary.errors} tone="text-coral-700" />
            <Stat icon={CopyX} label="Duplicadas" value={preview.summary.duplicates} tone="text-coral-700" />
          </div>
          <div className="card max-h-[32rem] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 border-b border-sand-200 bg-sand-50">
                <tr><th className="px-3 py-2 text-left">Linha</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-left">Id</th><th className="px-3 py-2 text-left">Nome</th><th className="px-3 py-2 text-left">Validação</th></tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {preview.rows.map((r) => (
                  <tr key={r.line} className={r.status === "error" || r.status === "duplicate" ? "bg-coral-50/40" : r.status === "warning" ? "bg-amber-50/40" : ""}>
                    <td className="px-3 py-2 text-ink-500">{r.line}</td>
                    <td className="px-3 py-2"><StatusPill status={r.status} /></td>
                    <td className="px-3 py-2 font-mono">{r.data.id_externo}</td>
                    <td className="px-3 py-2 font-medium text-ink-900">{r.data.nome}</td>
                    <td className="px-3 py-2 text-ink-700">{r.issues.length === 0 ? <span className="text-pine-700">ok</span> : <ul className="space-y-0.5">{r.issues.map((i, k) => <li key={k} className={i.level === "error" ? "text-coral-700" : "text-amber-700"}>{i.message}</li>)}</ul>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={confirming || preview.summary.ok + preview.summary.warnings === 0} onClick={() => start(async () => { setResult(await confirmImport(preview)); })} className="btn-primary">
              {confirming ? "Importando…" : `Confirmar e inserir ${preview.summary.ok + preview.summary.warnings} registros`}
            </button>
            <button type="button" onClick={() => window.location.reload()} className="btn-ghost">Cancelar</button>
            <p className="text-xs text-ink-500">Linhas com erro ou duplicadas são ignoradas. Fotos e logos são inseridos depois, pelo painel.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-8 w-8 shrink-0 text-pine-500" />
            <div>
              <h3 className="text-xl font-semibold text-pine-900">Importação concluída</h3>
              <p className="mt-1 text-sm text-ink-700">{result.inserted} registros inseridos, {result.skipped} ignorados.</p>
              {result.failures.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-coral-700">{result.failures.map((f) => <li key={f.line}>Linha {f.line}: {f.message}</li>)}</ul>
              )}
              <button type="button" onClick={() => window.location.reload()} className="btn-ghost btn-sm mt-4">Nova importação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "text-ink-900" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone?: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <Icon className={cn("h-5 w-5", tone)} />
      <div><p className={cn("font-display text-2xl font-semibold leading-none", tone)}>{value}</p><p className="mt-1 text-xs text-ink-500">{label}</p></div>
    </div>
  );
}

function StatusPill({ status }: { status: "ok" | "warning" | "error" | "duplicate" }) {
  const map = { ok: ["Pronta", "bg-pine-100 text-pine-800"], warning: ["Aviso", "bg-amber-100 text-amber-800"], error: ["Erro", "bg-coral-100 text-coral-700"], duplicate: ["Duplicada", "bg-coral-100 text-coral-700"] } as const;
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", map[status][1])}>{map[status][0]}</span>;
}
