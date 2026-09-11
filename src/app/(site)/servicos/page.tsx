import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getCompanies } from "@/lib/data";
import { CompanyCard } from "@/components/site/company-card";
import { FilterBar } from "@/components/site/filter-bar";
import { Pagination } from "@/components/site/pagination";
import { PageHeader, EmptyState } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Serviços", description: "Lojas, escritórios, estacionamento, lava-car e auditório do Vitalis Hub." };
export const dynamic = "force-dynamic";

type Search = { busca?: string; categoria?: string; pagina?: string };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const [result, categories] = await Promise.all([
    getCompanies({ q: sp.busca, category: sp.categoria, page: Number(sp.pagina ?? 1), kind: "SERVICE" }),
    getCategories("SERVICE"),
  ]);

  return (
    <>
      <PageHeader eyebrow="Conveniência" title="Lojas e serviços" description="Farmácia, ótica, café, escritórios de apoio, estacionamento com 320 vagas, lava-car e auditório para eventos. Reservas do auditório direto com a administração." />
      <div className="container-x">
        <Suspense>
          <FilterBar
            placeholder="Buscar loja ou serviço"
            total={result.total}
            noun={["serviço", "serviços"]}
            filters={[{ param: "categoria", label: "Categoria", options: categories.map((c) => ({ value: c.slug, label: c.name })) }]}
          />
        </Suspense>
        {result.items.length === 0 ? (
          <EmptyState title="Nenhum serviço encontrado" description="Tente outro termo ou limpe os filtros." />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((c) => <CompanyCard key={c.id} company={c} />)}
          </div>
        )}
        <Pagination page={result.page} pages={result.pages} params={sp} />
      </div>
    </>
  );
}
