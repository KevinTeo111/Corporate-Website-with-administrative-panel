import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { getSiteStats } from "@/lib/data";

export const metadata: Metadata = { title: "Sobre" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const stats = await getSiteStats();
  return (
    <>
      <PageHeader eyebrow="Institucional" title="Um prédio pensado para quem cuida e para quem é cuidado" description="O Vitalis Hub reúne clínicas, laboratório, exames de imagem, lojas e serviços de apoio em dez andares no coração de Moema." />
      <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 text-[17px] leading-8 text-ink-700">
          <p>Inaugurado para concentrar o cuidado em saúde em um único endereço, o prédio foi projetado com salas de espera compartilhadas por andar, circulação acessível e infraestrutura hospitalar leve: gases medicinais nos andares clínicos, geradores e climatização central.</p>
          <p>Os pacientes encontram tudo no mesmo lugar: consulta, exame, farmácia e ótica. Os profissionais encontram vizinhos que complementam sua especialidade, o que facilita encaminhamentos e reduz deslocamentos.</p>
          <p>A administração cuida da manutenção, da segurança 24 horas e do estacionamento com validação. Cada clínica e cada loja é independente: agendamentos, convênios e pagamentos são tratados diretamente com cada uma.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <img src="https://picsum.photos/seed/about-1/800/600" alt="Fachada do prédio" className="aspect-[4/3] rounded-2xl object-cover" loading="lazy" />
            <img src="https://picsum.photos/seed/about-2/800/600" alt="Recepção do térreo" className="aspect-[4/3] rounded-2xl object-cover" loading="lazy" />
            <img src="https://picsum.photos/seed/about-3/800/600" alt="Sala de espera de um andar clínico" className="aspect-[4/3] rounded-2xl object-cover" loading="lazy" />
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card p-6">
            <p className="eyebrow mb-4">Em números</p>
            <dl className="grid grid-cols-2 gap-4">
              {[[stats.companies, "empresas ativas"], [stats.professionals, "profissionais"], [stats.specialties, "especialidades"], ["320", "vagas de garagem"]].map(([n, l]) => (
                <div key={String(l)}><dt className="font-display text-3xl font-semibold text-pine-900">{n}</dt><dd className="text-xs text-ink-500">{l}</dd></div>
              ))}
            </dl>
          </div>
          <div className="card p-6">
            <p className="eyebrow mb-3">Estrutura</p>
            <ul className="space-y-2 text-sm text-ink-700">
              <li>Térreo com farmácia, ótica, café e loja ortopédica</li>
              <li>1º andar: auditório com 120 lugares</li>
              <li>2º andar: laboratório e diagnóstico por imagem</li>
              <li>3º ao 8º andar: clínicas e consultórios</li>
              <li>9º andar: escritórios de apoio</li>
              <li>2 subsolos de estacionamento e lava-car</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
