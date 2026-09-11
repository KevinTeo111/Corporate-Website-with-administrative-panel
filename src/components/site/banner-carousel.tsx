"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Banner } from "@prisma/client";
import { cn } from "@/lib/utils";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length, paused]);

  if (banners.length === 0) return null;
  const b = banners[i];

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-pine-900 shadow-lift sm:aspect-[16/10] lg:aspect-[4/3]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Destaques"
    >
      {banners.map((item, idx) => (
        <img
          key={item.id}
          src={item.imageUrl}
          alt=""
          aria-hidden={idx !== i}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", idx === i ? "opacity-100 animate-ken-burns" : "opacity-0")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-pine-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p key={b.id} className="animate-fade-up font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">{b.title}</p>
        {b.subtitle && <p key={`${b.id}-s`} className="animate-fade-up delay-100 mt-2 max-w-md text-sm text-pine-100/90">{b.subtitle}</p>}
        {b.link && (
          <Link href={b.link} className="animate-fade-up delay-200 mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            Saiba mais <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute right-5 top-5 flex gap-1.5">
          {banners.map((item, idx) => (
            <button key={item.id} type="button" aria-label={`Banner ${idx + 1}`} onClick={() => setI(idx)} className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80")} />
          ))}
        </div>
      )}
    </div>
  );
}
