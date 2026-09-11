import { PageTitle } from "@/components/admin/ui";
import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <>
      <PageTitle title="Novo artigo" description="Salve como rascunho e publique quando estiver pronto." />
      <ArticleForm values={{}} />
    </>
  );
}
