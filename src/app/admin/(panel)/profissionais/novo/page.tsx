import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { ProfessionalForm } from "@/components/admin/professional-form";

export default async function NewProfessionalPage() {
  const [specialties, companies] = await Promise.all([
    prisma.specialty.findMany({ orderBy: { name: "asc" } }),
    prisma.company.findMany({ select: { id: true, name: true, room: true, active: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <>
      <PageTitle title="Novo profissional" />
      <ProfessionalForm values={{}} specialties={specialties} companies={companies} />
    </>
  );
}
