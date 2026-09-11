"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Faq } from "@prisma/client";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="card divide-y divide-sand-200">
      {items.map((f, i) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : f.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-${f.id}`}
              className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
            >
              <span className="font-display text-sm text-ink-300">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("flex-1 text-base font-semibold transition-colors", isOpen ? "text-pine-800" : "text-ink-900")}>{f.question}</span>
              <Plus className={cn("h-5 w-5 shrink-0 text-pine-600 transition-transform duration-300", isOpen && "rotate-45")} />
            </button>
            <div id={`faq-${f.id}`} className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="px-5 pb-6 pl-[3.25rem] text-[15px] leading-7 text-ink-700 sm:px-6 sm:pl-[3.5rem]">{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
