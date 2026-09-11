import { cn } from "@/lib/utils";

export function Field({ label, name, error, children, hint, className }: { label: string; name: string; error?: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-300">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-coral-600" role="alert">{error}</p>}
    </div>
  );
}

export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
      <label>Não preencha<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function SubmitButton({ pending, children, className }: { pending: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button type="submit" disabled={pending} className={cn("btn-primary", className)}>
      {pending ? "Enviando…" : children}
    </button>
  );
}
