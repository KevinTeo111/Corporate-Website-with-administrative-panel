import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { ArticleTable } from "@/components/admin/article-table";

export default async function AdminBlogPage() {
  const articles = await prisma.article.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }] });
  return (
    <>
      <PageTitle title="Blog" description="Crie, edite, salve rascunhos, publique e retire artigos. Sem comentários e sem envio externo." action={{ href: "/admin/blog/novo", label: "Novo artigo" }} />
      <ArticleTable articles={articles} />
    </>
  );
}
