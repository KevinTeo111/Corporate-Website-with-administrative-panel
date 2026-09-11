import type { Metadata } from "next";
import { LayoutTemplate, ListOrdered, MousePointerClick } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { AdInquiryForm } from "@/components/site/ad-inquiry-form";

export const metadata: Metadata = { title: "Anuncie aqui" };

export default function AdvertisePage() {
  return (
    <>
      <PageHeader eyebrow="Publicidade" title="Anuncie para quem já está no prédio" description="Faixas na home e nas listagens de empresas e profissionais, com rodízio entre anunciantes e contagem de cliques. Sem pagamento on-line: o comercial fecha direto com você." />
      <div className="container-x grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {[
            [LayoutTemplate, "Duas posições", "Faixa na home (maior alcance) ou nas listagens de empresas e profissionais (público em busca ativa)."],
            [ListOrdered, "Rodízio justo", "Cada carregamento mostra um anúncio ativo da posição, alternando entre os anunciantes."],
            [MousePointerClick, "Relatório simples", "Contagem de cliques por anúncio, disponível para o comercial no painel."],
          ].map(([Icon, title, text]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <div key={String(title)} className="card flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine-50 text-pine-700"><I className="h-5 w-5" /></span>
                <div><p className="font-semibold text-ink-900">{String(title)}</p><p className="mt-1 text-sm text-ink-500">{String(text)}</p></div>
              </div>
            );
          })}
        </div>
        <AdInquiryForm />
      </div>
    </>
  );
}
