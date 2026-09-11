import type { Metadata } from "next";
import { Ruler, Layers, MessageCircle, Phone, Check } from "lucide-react";
import { getRooms } from "@/lib/data";
import { PageHeader } from "@/components/site/page-header";
import { RoomLeadForm } from "@/components/site/room-lead-form";
import { RoomGallery } from "@/components/site/room-gallery";
import { roomModeLabel, whatsappLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Salas", description: "Salas e conjuntos para locação ou venda no Vitalis Hub." };
export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await getRooms(true);
  const hasOffers = rooms.length > 0;

  return (
    <>
      <PageHeader eyebrow="Locação e venda" title="Salas e conjuntos" description="Infraestrutura pronta para clínica ou escritório: ar-condicionado, rede, recepção compartilhada e estacionamento. Condições direto com a administração." />
      <div className="container-x space-y-6">
        {!hasOffers && (
          <div className="rounded-2xl border border-coral-200 bg-coral-50 p-5 text-sm text-coral-700">
            No momento não há salas disponíveis. Cadastre seu interesse abaixo e avisamos quando surgir uma sala com o seu perfil.
          </div>
        )}

        {rooms.map((r) => (
          <article key={r.id} className="card grid overflow-hidden lg:grid-cols-[1.1fr_1fr]">
            <RoomGallery photos={r.photos} title={r.title} />
            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-pine-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{roomModeLabel[r.mode]}</span>
                <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">Disponível</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-pine-900 sm:text-3xl">{r.title}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-700">
                <span className="inline-flex items-center gap-1.5"><Ruler className="h-4 w-4 text-coral-500" />{r.areaM2} m²</span>
                <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4 text-coral-500" />{r.floor}º andar · {r.code}</span>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-ink-700">{r.description}</p>
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {r.features.map((f) => (
                  <li key={f} className="inline-flex items-center gap-2 text-sm text-ink-700"><Check className="h-4 w-4 text-pine-500" />{f}</li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <p className="text-xs text-ink-500">Responsável: {r.contactName} · {r.contactPhone}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={whatsappLink(r.contactWhatsapp, `Olá, tenho interesse na ${r.title} (${r.code}). Podem me passar as condições?`)} target="_blank" rel="noopener" className="btn-accent"><MessageCircle className="h-4 w-4" /> Consulte condições</a>
                  <a href={`tel:${r.contactPhone.replace(/\D/g, "")}`} className="btn-ghost"><Phone className="h-4 w-4" /> Ligar</a>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="pt-6">
          <RoomLeadForm highlighted={!hasOffers} />
        </div>
      </div>
    </>
  );
}
