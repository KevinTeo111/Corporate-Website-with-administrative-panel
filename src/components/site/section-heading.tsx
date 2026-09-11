import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, description, href, linkLabel }: { eyebrow?: string; title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-3xl font-semibold text-pine-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-2 text-base leading-7 text-ink-500">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 hover:text-pine-900">
          {linkLabel ?? "Ver todos"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
