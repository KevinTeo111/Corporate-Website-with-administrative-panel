import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { CompanyForm } from "@/components/admin/company-form";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, categories, specialties] = await Promise.all([
    prisma.company.findUnique({ where: { id }, include: { specialties: { select: { id: true } } } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!company) notFound();
  return (
    <>
      <PageTitle title={company.name} description={`Id externo ${company.externalId}`} />
      <CompanyForm values={{ ...company, specialtyIds: company.specialties.map((s) => s.id) }} categories={categories} specialties={specialties} />
    </>
  );
}
