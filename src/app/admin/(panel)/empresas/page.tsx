import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { CompanyTable } from "@/components/admin/company-table";
import { AdminSearch } from "@/components/admin/admin-search";

export default async function AdminCompaniesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const companies = await prisma.company.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { externalId: { contains: q, mode: "insensitive" } }, { room: { contains: q, mode: "insensitive" } }] } : undefined,
    include: { category: true, _count: { select: { professionals: true } } },
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
  return (
    <>
      <PageTitle title="Empresas" description={`${companies.length} registro${companies.length === 1 ? "" : "s"}. Ative, desative ou destaque sem sair da lista.`} action={{ href: "/admin/empresas/nova", label: "Nova empresa" }} />
      <AdminSearch placeholder="Buscar por nome, id externo ou sala" />
      <CompanyTable companies={companies} />
    </>
  );
}
