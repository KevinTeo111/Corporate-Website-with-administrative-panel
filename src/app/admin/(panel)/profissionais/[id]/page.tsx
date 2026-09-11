import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { ProfessionalForm } from "@/components/admin/professional-form";

export default async function EditProfessionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, specialties, companies] = await Promise.all([
    prisma.professional.findUnique({ where: { id }, include: { specialties: { select: { id: true } }, companies: { select: { companyId: true } } } }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
    prisma.company.findMany({ select: { id: true, name: true, room: true, active: true }, orderBy: { name: "asc" } }),
  ]);
  if (!p) notFound();
  return (
    <>
      <PageTitle title={p.name} description={`Id externo ${p.externalId}`} />
      <ProfessionalForm values={{ ...p, specialtyIds: p.specialties.map((s) => s.id), companyIds: p.companies.map((c) => c.companyId) }} specialties={specialties} companies={companies} />
    </>
  );
}
