import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { getArticleBySlug, getPublishedArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  return a ? { title: a.title, description: a.excerpt } : { title: "Artigo" };
}

/** Very small markdown subset: "## heading" and paragraphs. Enough for the demo content. */
function renderBody(body: string) {
  return body.split(/\n\s*\n/).map((block, i) => {
    const h = block.match(/^##\s+(.*)$/);
    if (h) return <h2 key={i}>{h[1]}</h2>;
    return <p key={i}>{block}</p>;
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const related = (await getPublishedArticles(4)).filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article>
      <div className="container-x pt-8">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Voltar ao blog</Link>
      </div>
      <header className="container-x max-w-3xl py-8">
        <p className="eyebrow mb-3">{article.category}</p>
        <h1 className="text-4xl font-semibold leading-tight text-pine-900 sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg leading-8 text-ink-500">{article.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4 text-coral-500" />{article.author}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-coral-500" />{formatDate(article.publishedAt, { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      </header>
      {article.coverUrl && (
        <div className="container-x">
          <img src={article.coverUrl} alt="" className="aspect-[21/9] w-full rounded-3xl object-cover shadow-soft" />
        </div>
      )}
      <div className="container-x prose-article max-w-3xl py-10">{renderBody(article.body)}</div>

      {related.length > 0 && (
        <aside className="container-x mt-6">
          <h2 className="mb-4 text-xl font-semibold text-pine-900">Leia também</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="card card-hover p-5">
                <p className="text-xs font-semibold text-coral-600">{a.category}</p>
                <p className="mt-1.5 font-sans text-sm font-bold text-ink-900">{a.title}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
