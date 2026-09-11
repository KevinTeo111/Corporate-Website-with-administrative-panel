import type { Metadata } from "next";
import { MapPin, Clock, Phone, MessageCircle, TrainFront, Car, Accessibility } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Localização e contato" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contato" title="Como chegar e falar com a administração" description="Agendamentos são feitos diretamente com cada clínica. A administração cuida do prédio, das salas e da publicidade." />
      <div className="container-x grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="card p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span><strong className="block text-ink-900">Endereço</strong>Av. Ibirapuera, 2.500 · Moema, São Paulo - SP · CEP 04028-002</span></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span><strong className="block text-ink-900">Horário do prédio</strong>Segunda a sábado, 6h às 22h</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span><strong className="block text-ink-900">Administração</strong>(11) 3045-0010 · Seg a Sex, 8h às 18h</span></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={whatsappLink("5511987000010", "Olá, administração do Vitalis Hub.")} target="_blank" rel="noopener" className="btn-primary"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              <a href="tel:1130450010" className="btn-ghost"><Phone className="h-4 w-4" /> Ligar</a>
            </div>
          </div>
          <div className="card p-6">
            <p className="eyebrow mb-3">Acesso</p>
            <ul className="space-y-3 text-sm text-ink-700">
              <li className="flex gap-3"><TrainFront className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" />Metrô Eucaliptos (Linha 5-Lilás) a 400 m. Linhas de ônibus na Av. Ibirapuera.</li>
              <li className="flex gap-3"><Car className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" />Estacionamento com 320 vagas, entrada pela rua lateral. Validação de ticket nas clínicas.</li>
              <li className="flex gap-3"><Accessibility className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" />Rampas, elevadores com braile, banheiros adaptados e vagas reservadas.</li>
            </ul>
          </div>
        </div>
        <iframe
          title="Mapa do Vitalis Hub"
          className="min-h-[24rem] w-full rounded-3xl border-0 shadow-soft"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Av.+Ibirapuera,+2500,+Moema,+S%C3%A3o+Paulo&output=embed"
        />
      </div>
    </>
  );
}
