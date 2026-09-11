import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { CompanyForm } from "@/components/admin/company-form";

export default async function NewCompanyPage() {
  const [categories, specialties] = await Promise.all([prisma.category.findMany({ orderBy: { order: "asc" } }), prisma.specialty.findMany({ orderBy: { name: "asc" } })]);
  return (
    <>
      <PageTitle title="Nova empresa" description="Cadastro manual. Para muitos registros, use a importação por planilha." />
      <CompanyForm values={{}} categories={categories} specialties={specialties} />
    </>
  );
}
