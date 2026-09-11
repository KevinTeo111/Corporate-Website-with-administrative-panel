import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/article-form";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();
  return (
    <>
      <PageTitle title="Editar artigo" description={article.title} />
      <ArticleForm values={article} />
    </>
  );
}
