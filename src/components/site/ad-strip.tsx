import Link from "next/link";
import { pickAd } from "@/lib/data";
import type { AdGroup } from "@prisma/client";

/** Server component: one random active ad per render, click counted through /api/ads/[id]/click. */
export async function AdStrip({ group, position = 1, className = "" }: { group: AdGroup; position?: number; className?: string }) {
  const ad = await pickAd(group, position);
  if (!ad) return null;
  return (
    <aside className={`container-x ${className}`} aria-label="Publicidade">
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-sand-300">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">Publicidade</span>
        <a href={`/api/ads/${ad.id}/click`} target="_blank" rel="noopener sponsored" aria-label={`Anúncio de ${ad.advertiser}`}>
          <picture>
            <source media="(max-width: 640px)" srcSet={ad.imageMobile} />
            <img src={ad.imageDesktop} alt={ad.advertiser} className="h-28 w-full object-cover sm:h-32 md:h-36" loading="lazy" />
          </picture>
        </a>
        <Link href="/anuncie" className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-pine-900 backdrop-blur transition hover:bg-white">Anuncie aqui</Link>
      </div>
    </aside>
  );
}
