"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, MessageCircle, Instagram, Globe, X, ChevronLeft, ChevronRight, Users, Star } from "lucide-react";
import type { CompanyWithRelations } from "@/lib/data";
import { Avatar } from "./avatar";
import { cn, floorLabel, whatsappLink } from "@/lib/utils";

export function CompanyCard({ company, compact = false }: { company: CompanyWithRelations; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("card card-hover group flex w-full flex-col p-5 text-left", compact && "p-4")}
        aria-haspopup="dialog"
      >
        <div className="flex items-start gap-4">
          <Avatar name={company.name} src={company.logoUrl} size={compact ? "md" : "lg"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-sans text-base font-bold leading-tight text-ink-900 group-hover:text-pine-800">{company.name}</h3>
              {company.featured && <Star className="h-4 w-4 shrink-0 fill-coral-400 text-coral-400" aria-label="Destaque" />}
            </div>
            <p className="mt-1 text-xs font-medium text-ink-500">{company.category.name}</p>
          </div>
        </div>

        {!compact && <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-500">{company.description}</p>}

        {company.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {company.specialties.slice(0, 3).map((s) => (
              <span key={s.id} className="rounded-full bg-pine-50 px-2.5 py-0.5 text-[11px] font-semibold text-pine-700">{s.name}</span>
            ))}
            {company.specialties.length > 3 && <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-semibold text-ink-500">+{company.specialties.length - 3}</span>}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-coral-500" />Sala {company.room} · {floorLabel(company.floor)}</span>
          <span className="font-semibold text-pine-700 group-hover:underline">Ver detalhes</span>
        </div>
      </button>
      {open && <CompanyDialog company={company} onClose={() => setOpen(false)} />}
    </>
  );
}

export function CompanyDialog({ company, onClose }: { company: CompanyWithRelations; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [photo, setPhoto] = useState(0);
  const photos = company.photos.length ? company.photos : [];
  const pros = company.professionals.filter((p) => p.professional.active);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    document.body.style.overflow = "hidden";
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    d.addEventListener("cancel", onCancel);
    return () => { d.removeEventListener("cancel", onCancel); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="m-auto w-[min(100vw-1.5rem,64rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-3xl bg-white p-0 shadow-lift backdrop:bg-pine-950/60 backdrop:backdrop-blur-sm open:animate-fade-up"
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-labelledby={`dlg-${company.id}`}
    >
      <div className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_1fr] md:grid-cols-[1.1fr_1fr] md:grid-rows-1">
        {/* Gallery */}
        <div className="relative aspect-[4/3] bg-sand-200 md:aspect-auto md:h-full md:min-h-[28rem]">
          {photos.length > 0 ? (
            <img key={photo} src={photos[photo]} alt={`Foto ${photo + 1} de ${company.name}`} className="h-full w-full object-cover animate-fade-up" />
          ) : (
            <div className="grid h-full place-items-center text-ink-300">Sem fotos</div>
          )}
          {photos.length > 1 && (
            <>
              <button type="button" aria-label="Foto anterior" onClick={() => setPhoto((p) => (p - 1 + photos.length) % photos.length)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-pine-900 shadow-soft transition hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Próxima foto" onClick={() => setPhoto((p) => (p + 1) % photos.length)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-pine-900 shadow-soft transition hover:bg-white"><ChevronRight className="h-5 w-5" /></button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {photos.map((_, i) => (
                  <button key={i} type="button" aria-label={`Ir para foto ${i + 1}`} onClick={() => setPhoto(i)} className={cn("h-1.5 rounded-full transition-all", i === photo ? "w-6 bg-white" : "w-1.5 bg-white/60")} />
                ))}
              </div>
            </>
          )}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 py-1 pl-1 pr-3 shadow-soft backdrop-blur">
            <Avatar name={company.name} src={company.logoUrl} size="sm" rounded="rounded-full" />
            <span className="text-xs font-semibold text-pine-900">{company.category.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex min-h-0 flex-col overflow-y-auto">
          <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-sand-100 text-ink-700 transition hover:bg-sand-200"><X className="h-4 w-4" /></button>
          <div className="p-6 pt-7 sm:p-8">
            <h2 id={`dlg-${company.id}`} className="pr-10 text-2xl font-semibold text-pine-900 sm:text-3xl">{company.name}</h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-700">{company.description}</p>

            {company.specialties.length > 0 && (
              <div className="mt-5">
                <p className="label">Especialidades</p>
                <div className="flex flex-wrap gap-1.5">
                  {company.specialties.map((s) => <span key={s.id} className="rounded-full bg-pine-50 px-2.5 py-1 text-xs font-semibold text-pine-700">{s.name}</span>)}
                </div>
              </div>
            )}

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info icon={MapPin} label="Localização" value={`Sala ${company.room} · ${floorLabel(company.floor)}`} />
              <Info icon={Clock} label="Horários" value={company.hours} />
              <Info icon={Phone} label="Telefone" value={company.phone} href={`tel:${company.phone.replace(/\D/g, "")}`} />
              {company.instagram && <Info icon={Instagram} label="Instagram" value={`@${company.instagram}`} href={`https://instagram.com/${company.instagram}`} />}
              {company.website && <Info icon={Globe} label="Site" value={company.website.replace(/^https?:\/\//, "")} href={company.website} />}
            </dl>

            {pros.length > 0 && (
              <div className="mt-6 rounded-2xl bg-sand-100 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500"><Users className="h-3.5 w-3.5" /> Profissionais que atendem aqui</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {pros.map((p) => (
                    <li key={p.professional.id}>
                      <Link href={`/profissionais?empresa=${company.slug}`} className="font-medium text-pine-800 hover:underline">{p.professional.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={whatsappLink(company.whatsapp, `Olá, encontrei ${company.name} no site do Vitalis Hub e gostaria de agendar.`)} target="_blank" rel="noopener" className="btn-primary"><MessageCircle className="h-4 w-4" /> Chamar no WhatsApp</a>
              <a href={`tel:${company.phone.replace(/\D/g, "")}`} className="btn-ghost"><Phone className="h-4 w-4" /> Ligar</a>
            </div>
            <p className="mt-3 text-xs text-ink-300">Agendamentos são feitos diretamente com a empresa.</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Info({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-sand-200 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
      <div className="min-w-0">
        <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-300">{label}</dt>
        <dd className="truncate text-sm font-medium text-ink-900">
          {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="hover:text-pine-700 hover:underline">{value}</a> : value}
        </dd>
      </div>
    </div>
  );
}
