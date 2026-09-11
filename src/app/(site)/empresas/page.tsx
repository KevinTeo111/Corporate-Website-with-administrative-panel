import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getCompanies, getSpecialties } from "@/lib/data";
import { CompanyCard } from "@/components/site/company-card";
import { FilterBar } from "@/components/site/filter-bar";
import { Pagination } from "@/components/site/pagination";
import { PageHeader, EmptyState } from "@/components/site/page-header";
import { AdStrip } from "@/components/site/ad-strip";
import { floorLabel } from "@/lib/utils";

export const metadata: Metadata = { title: "Empresas", description: "Clínicas, laboratórios e consultórios do Vitalis Hub com sala, andar, horários e contato." };
export const dynamic = "force-dynamic";

type Search = { busca?: string; categoria?: string; especialidade?: string; andar?: string; pagina?: string };

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const [result, categories, specialties] = await Promise.all([
    getCompanies({ q: sp.busca, category: sp.categoria, specialty: sp.especialidade, floor: sp.andar, page: Number(sp.pagina ?? 1), kind: "COMPANY" }),
    getCategories("COMPANY"),
    getSpecialties(),
  ]);
  const floors = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <>
      <PageHeader eyebrow="Diretório" title="Empresas e clínicas" description="Busque por nome ou especialidade, filtre por categoria e abra o cartão para ver sala, andar, horários e WhatsApp." />
      <div className="container-x">
        <Suspense>
          <FilterBar
            placeholder="Buscar por nome, especialidade ou serviço"
            total={result.total}
            noun={["empresa", "empresas"]}
            filters={[
              { param: "categoria", label: "Categoria", options: categories.map((c) => ({ value: c.slug, label: c.name })) },
              { param: "especialidade", label: "Especialidade", mode: "select", options: specialties.map((s) => ({ value: s.slug, label: s.name })) },
              { param: "andar", label: "Andar", mode: "select", options: floors.map((f) => ({ value: String(f), label: floorLabel(f) })) },
            ]}
          />
        </Suspense>

        {result.items.length === 0 ? (
          <EmptyState title="Nenhuma empresa encontrada" description="Tente outro termo ou limpe os filtros. Se procura lojas, estacionamento ou auditório, veja a página de serviços." />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((c) => <CompanyCard key={c.id} company={c} />)}
          </div>
        )}
        <Pagination page={result.page} pages={result.pages} params={sp} />
      </div>
      <AdStrip group="DIRECTORY" position={1} className="mt-12" />
    </>
  );
}
