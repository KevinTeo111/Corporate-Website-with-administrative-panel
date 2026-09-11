import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { ProfessionalTable } from "@/components/admin/professional-table";
import { AdminSearch } from "@/components/admin/admin-search";

export default async function AdminProfessionalsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const professionals = await prisma.professional.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { externalId: { contains: q, mode: "insensitive" } }, { registration: { contains: q } }] } : undefined,
    include: { specialties: true, companies: { include: { company: { select: { name: true } } } } },
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
  return (
    <>
      <PageTitle title="Profissionais" description={`${professionals.length} registro${professionals.length === 1 ? "" : "s"}. Cada profissional pode ter várias especialidades e várias empresas.`} action={{ href: "/admin/profissionais/novo", label: "Novo profissional" }} />
      <AdminSearch placeholder="Buscar por nome, id externo ou registro" />
      <ProfessionalTable professionals={professionals} />
    </>
  );
}
