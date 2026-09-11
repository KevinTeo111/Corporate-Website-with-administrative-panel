"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-pine-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {action && <Link href={action.href} className="btn-primary btn-sm">{action.label}</Link>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => Promise<void> | void; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={pending}
      onClick={() => start(async () => { await onChange(!checked); })}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", checked ? "bg-pine-600" : "bg-sand-300", pending && "opacity-60")}
    >
      <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")} />
      {pending && <Loader2 className="absolute -right-6 h-4 w-4 animate-spin text-ink-300" />}
    </button>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "bad" | "info"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-sand-100 text-ink-700",
    good: "bg-pine-100 text-pine-800",
    warn: "bg-amber-100 text-amber-800",
    bad: "bg-coral-100 text-coral-700",
    info: "bg-sky-100 text-sky-800",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide", tones[tone])}>{children}</span>;
}

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("card overflow-x-auto", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function ActionButton({ onClick, children, tone = "ghost", className }: { onClick: () => Promise<void> | void; children: React.ReactNode; tone?: "ghost" | "primary" | "danger"; className?: string }) {
  const [pending, start] = useTransition();
  const tones = { ghost: "btn-ghost", primary: "btn-primary", danger: "btn bg-coral-50 text-coral-700 ring-1 ring-coral-200 hover:bg-coral-100" };
  return (
    <button type="button" disabled={pending} onClick={() => start(async () => { await onClick(); })} className={cn(tones[tone], "btn-sm", className)}>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
    </button>
  );
}
