import type { Metadata } from "next";
import { Suspense } from "react";
import { getActiveCompaniesLite, getProfessionals, getSpecialties } from "@/lib/data";
import { ProfessionalCard } from "@/components/site/professional-card";
import { FilterBar } from "@/components/site/filter-bar";
import { Pagination } from "@/components/site/pagination";
import { PageHeader, EmptyState } from "@/components/site/page-header";
import { AdStrip } from "@/components/site/ad-strip";

export const metadata: Metadata = { title: "Profissionais", description: "Médicos, dentistas, fisioterapeutas e outros profissionais que atendem no Vitalis Hub." };
export const dynamic = "force-dynamic";

type Search = { busca?: string; especialidade?: string; empresa?: string; pagina?: string };

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const [result, specialties, companies] = await Promise.all([
    getProfessionals({ q: sp.busca, specialty: sp.especialidade, company: sp.empresa, page: Number(sp.pagina ?? 1) }),
    getSpecialties(),
    getActiveCompaniesLite(),
  ]);

  return (
    <>
      <PageHeader eyebrow="Diretório" title="Profissionais" description="Cada profissional aparece com registro no conselho, especialidades e todos os locais onde atende, com o contato de cada um." />
      <div className="container-x">
        <Suspense>
          <FilterBar
            placeholder="Buscar por nome, especialidade ou clínica"
            total={result.total}
            noun={["profissional", "profissionais"]}
            filters={[
              { param: "especialidade", label: "Especialidade", mode: "select", options: specialties.map((s) => ({ value: s.slug, label: s.name })) },
              { param: "empresa", label: "Empresa", mode: "select", options: companies.map((c) => ({ value: c.slug, label: c.name })) },
            ]}
          />
        </Suspense>

        {result.items.length === 0 ? (
          <EmptyState title="Nenhum profissional encontrado" description="Tente outro nome ou especialidade, ou limpe os filtros." />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((p) => <ProfessionalCard key={p.id} professional={p} />)}
          </div>
        )}
        <Pagination page={result.page} pages={result.pages} params={sp} />
      </div>
      <AdStrip group="DIRECTORY" position={1} className="mt-12" />
    </>
  );
}
