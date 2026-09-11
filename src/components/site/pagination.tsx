import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ page, pages, params }: { page: number; pages: number; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("pagina", String(p)); else sp.delete("pagina");
    const s = sp.toString();
    return s ? `?${s}` : "?";
  };
  const items = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginação">
      <Link href={href(Math.max(1, page - 1))} aria-disabled={page === 1} className={cn("btn-ghost btn-sm", page === 1 && "pointer-events-none opacity-40")}><ChevronLeft className="h-4 w-4" /> Anterior</Link>
      {items.map((p, i) => {
        const gap = i > 0 && p - items[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-ink-300">…</span>}
            <Link href={href(p)} aria-current={p === page ? "page" : undefined} className={cn("grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition", p === page ? "bg-pine-800 text-white" : "text-ink-700 hover:bg-white hover:ring-1 hover:ring-sand-300")}>{p}</Link>
          </span>
        );
      })}
      <Link href={href(Math.min(pages, page + 1))} aria-disabled={page === pages} className={cn("btn-ghost btn-sm", page === pages && "pointer-events-none opacity-40")}>Próxima <ChevronRight className="h-4 w-4" /></Link>
    </nav>
  );
}
