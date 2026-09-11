import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/site/page-header";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog", description: "Artigos dos profissionais do Vitalis Hub sobre saúde e bem-estar." };
export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const all = await getPublishedArticles();
  const categories = [...new Set(all.map((a) => a.category))];
  const articles = categoria ? all.filter((a) => a.category === categoria) : all;
  const [first, ...rest] = articles;

  return (
    <>
      <PageHeader eyebrow="Blog" title="Saúde explicada por quem atende aqui" description="Orientações práticas dos profissionais do prédio. Sem comentários, sem newsletter, só conteúdo.">
        {categories.length > 0 && (
          <div className="scrollbar-none mt-6 flex gap-1.5 overflow-x-auto">
            <Link href="/blog" className={`chip shrink-0 ${!categoria ? "chip-active" : ""}`}>Todas</Link>
            {categories.map((c) => <Link key={c} href={`/blog?categoria=${encodeURIComponent(c)}`} className={`chip shrink-0 ${categoria === c ? "chip-active" : ""}`}>{c}</Link>)}
          </div>
        )}
      </PageHeader>
      <div className="container-x">
        {articles.length === 0 ? (
          <EmptyState title="Ainda não há artigos" description="Os primeiros artigos aparecem aqui assim que forem publicados pelo painel." />
        ) : (
          <>
            <Link href={`/blog/${first.slug}`} className="card card-hover group grid overflow-hidden md:grid-cols-2">
              {first.coverUrl && <img src={first.coverUrl} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02] md:h-full" />}
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-semibold text-coral-600">{first.category}</p>
                <h2 className="mt-2 text-2xl font-semibold leading-snug text-pine-900 sm:text-3xl group-hover:underline">{first.title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-500">{first.excerpt}</p>
                <p className="mt-4 text-xs text-ink-500">{first.author} · {formatDate(first.publishedAt)}</p>
              </div>
            </Link>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="card card-hover group overflow-hidden">
                  {a.coverUrl && <img src={a.coverUrl} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-coral-600">{a.category}</p>
                    <h3 className="mt-1.5 font-sans text-base font-bold leading-snug text-ink-900 group-hover:text-pine-800">{a.title}</h3>
                    <p className="mt-2 text-xs text-ink-500">{a.author} · {formatDate(a.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
