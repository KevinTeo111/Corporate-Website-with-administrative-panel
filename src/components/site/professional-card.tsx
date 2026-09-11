import Link from "next/link";
import { MapPin, MessageCircle, Phone, BadgeCheck } from "lucide-react";
import type { ProfessionalWithRelations } from "@/lib/data";
import { Avatar } from "./avatar";
import { floorLabel, whatsappLink } from "@/lib/utils";

export function ProfessionalCard({ professional: p }: { professional: ProfessionalWithRelations }) {
  const places = p.companies.filter((c) => c.company.active);
  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-start gap-4">
        <Avatar name={p.name} src={p.photoUrl} size="lg" rounded="rounded-full" />
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-bold leading-tight text-ink-900">{p.name}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-ink-500">
            <BadgeCheck className="h-3.5 w-3.5 text-pine-500" />
            {p.council} {p.registration}/{p.uf}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.specialties.map((s) => (
              <Link key={s.id} href={`/profissionais?especialidade=${s.slug}`} className="rounded-full bg-pine-50 px-2.5 py-0.5 text-[11px] font-semibold text-pine-700 hover:bg-pine-100">{s.name}</Link>
            ))}
          </div>
        </div>
      </div>

      {p.bio && <p className="mt-3 text-sm leading-6 text-ink-500">{p.bio}</p>}

      <ul className="mt-4 space-y-2 border-t border-sand-200 pt-3">
        {places.map((link) => (
          <li key={link.companyId} className="flex items-center justify-between gap-3 rounded-xl bg-sand-50 px-3 py-2">
            <div className="min-w-0">
              <Link href={`/empresas?busca=${encodeURIComponent(link.company.name)}`} className="block truncate text-sm font-semibold text-pine-900 hover:underline">{link.company.name}</Link>
              <p className="inline-flex items-center gap-1 text-xs text-ink-500"><MapPin className="h-3 w-3 text-coral-500" />Sala {link.company.room} · {floorLabel(link.company.floor)}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <a href={`tel:${(link.contactPhone ?? link.company.phone).replace(/\D/g, "")}`} aria-label={`Ligar para ${link.company.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-sand-300 transition hover:ring-pine-400"><Phone className="h-3.5 w-3.5 text-pine-800" /></a>
              <a href={whatsappLink(link.contactWhatsapp ?? link.company.whatsapp, `Olá, gostaria de agendar com ${p.name}.`)} target="_blank" rel="noopener" aria-label={`WhatsApp de ${link.company.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-pine-800 text-white transition hover:bg-pine-700"><MessageCircle className="h-3.5 w-3.5" /></a>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
