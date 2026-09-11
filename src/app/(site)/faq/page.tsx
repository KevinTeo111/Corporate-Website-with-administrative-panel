import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/site/page-header";
import { FaqAccordion } from "@/components/site/faq-accordion";

export const metadata: Metadata = { title: "Perguntas frequentes" };
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <PageHeader eyebrow="Ajuda" title="Perguntas frequentes" description="Agendamento, estacionamento, convênios, acessibilidade e salas. Se não achar a resposta, fale com a administração." />
      <div className="container-x grid gap-8 lg:grid-cols-[1fr_320px]">
        {faqs.length === 0 ? <EmptyState title="Nenhuma pergunta cadastrada" description="As perguntas aparecem aqui quando forem ativadas no painel." /> : <FaqAccordion items={faqs} />}
        <aside className="card h-fit p-6">
          <p className="font-display text-xl text-pine-900">Não encontrou?</p>
          <p className="mt-2 text-sm text-ink-500">A administração responde de segunda a sexta, das 8h às 18h.</p>
          <Link href="/contato" className="btn-primary mt-4 w-full">Falar com a administração</Link>
        </aside>
      </div>
    </>
  );
}
