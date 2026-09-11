import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Vitalis Hub, página inicial">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-pine-800 text-white transition-transform duration-300 group-hover:rotate-[-6deg]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 20V9l8-5 8 5v11" />
          <path d="M9 20v-5h6v5" />
          <path d="M12 8v4M10 10h4" className="text-coral-400" stroke="currentColor" />
        </svg>
      </span>
      <span className={cn("font-display text-xl font-semibold leading-none", light ? "text-white" : "text-pine-900")}>
        Vitalis<span className={light ? "text-coral-400" : "text-coral-500"}>.</span>Hub
      </span>
    </Link>
  );
}
