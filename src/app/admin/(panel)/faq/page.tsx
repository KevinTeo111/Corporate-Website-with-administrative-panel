import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { FaqManager } from "@/components/admin/faq-manager";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageTitle title="Perguntas frequentes" description="Crie, edite, ordene, ative ou desative. A ordem daqui é a ordem do site." />
      <FaqManager faqs={faqs} />
    </>
  );
}
