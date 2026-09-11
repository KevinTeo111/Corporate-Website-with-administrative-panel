import Link from "next/link";
import { ArrowRight, MapPin, Clock, Phone, MessageCircle, Stethoscope, Smile, ScanLine, HeartPulse, Brain, Sparkles, ShoppingBag, Briefcase, Car, Droplets, Presentation, DoorOpen } from "lucide-react";
import { getBanners, getCategories, getFeaturedCompanies, getFloorMap, getPublishedArticles, getRooms, getSiteStats } from "@/lib/data";
import { HeroSearch } from "@/components/site/hero-search";
import { BannerCarousel } from "@/components/site/banner-carousel";
import { FloorNavigator } from "@/components/site/floor-navigator";
import { CompanyCard } from "@/components/site/company-card";
import { SectionHeading } from "@/components/site/section-heading";
import { AdStrip } from "@/components/site/ad-strip";
import { formatDate, whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope, smile: Smile, scan: ScanLine, "heart-pulse": HeartPulse, brain: Brain, sparkles: Sparkles,
  "shopping-bag": ShoppingBag, briefcase: Briefcase, car: Car, droplets: Droplets, presentation: Presentation,
};

export default async function HomePage() {
  const [banners, categories, featured, floors, articles, rooms, stats] = await Promise.all([
    getBanners(), getCategories(), getFeaturedCompanies(6), getFloorMap(), getPublishedArticles(3), getRooms(true), getSiteStats(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pine-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-coral-100 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="animate-fade-up">
            <p className="eyebrow mb-4">Centro de saúde e negócios · Moema, São Paulo</p>
            <h1 className="text-4xl font-semibold leading-[1.05] text-pine-900 sm:text-5xl lg:text-6xl">
              Clínicas, exames e serviços. <span className="text-coral-500">Um endereço.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-500">
              Encontre a clínica ou o profissional, veja a sala e o andar, e fale direto pelo WhatsApp. Sem cadastro, sem intermediários.
            </p>
            <div className="mt-8 max-w-xl"><HeroSearch /></div>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [stats.companies, "empresas"],
                [stats.professionals, "profissionais"],
                [stats.specialties, "especialidades"],
                [stats.floors, "andares"],
              ].map(([n, label]) => (
                <div key={label} className="rounded-2xl border border-sand-300/70 bg-white/60 px-4 py-3 backdrop-blur">
                  <dt className="font-display text-2xl font-semibold text-pine-900">{n}</dt>
                  <dd className="text-xs font-medium text-ink-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-fade-up delay-200"><BannerCarousel banners={banners} /></div>
        </div>
      </section>

      {/* Floor navigator */}
      <section className="container-x mt-8">
        <SectionHeading eyebrow="Mapa do prédio" title="Quem atende em cada andar" description="Toque em um andar para ver as empresas, a sala e a categoria de cada uma." />
        <FloorNavigator floors={floors} />
      </section>

      {/* Categories */}
      <section className="container-x mt-20">
        <SectionHeading eyebrow="Por área" title="Explore por categoria" href="/empresas" linkLabel="Diretório completo" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const Icon = icons[c.icon ?? ""] ?? Stethoscope;
            const href = c.kind === "SERVICE" ? `/servicos?categoria=${c.slug}` : `/empresas?categoria=${c.slug}`;
            return (
              <Link key={c.id} href={href} className="card card-hover group flex flex-col gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-pine-50 text-pine-700 transition group-hover:bg-pine-800 group-hover:text-white"><Icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-ink-900">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <AdStrip group="HOME" position={1} className="mt-16" />

      {/* Featured companies */}
      <section className="container-x mt-20">
        <SectionHeading eyebrow="Destaques" title="Empresas em destaque" href="/empresas" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => <CompanyCard key={c.id} company={c} />)}
        </div>
      </section>

      {/* Rooms */}
      <section className="container-x mt-20">
        <div className="overflow-hidden rounded-3xl bg-pine-900 text-white">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-pine-300">Salas</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Seu consultório no Vitalis Hub</h2>
              <p className="mt-3 max-w-md text-pine-100/80">
                {rooms.length > 0
                  ? `${rooms.length} ${rooms.length === 1 ? "sala disponível" : "salas disponíveis"} para locação ou compra, com infraestrutura pronta para atender.`
                  : "No momento não há salas disponíveis. Deixe seu interesse e avisamos quando surgir uma sala com o seu perfil."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/salas" className="btn-accent"><DoorOpen className="h-4 w-4" /> Ver salas</Link>
                <Link href="/salas#avise-me" className="btn bg-white/10 text-white hover:bg-white/20">Avise-me quando houver</Link>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {rooms.slice(0, 2).map((r) => (
                <li key={r.id} className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <img src={r.photos[0]} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="p-4">
                    <p className="font-semibold">{r.title}</p>
                    <p className="mt-1 text-xs text-pine-200">{r.areaM2} m² · {r.floor}º andar</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Articles (hidden while empty) */}
      {articles.length > 0 && (
        <section className="container-x mt-20">
          <SectionHeading eyebrow="Blog" title="Artigos recentes" href="/blog" />
          <div className="grid gap-4 md:grid-cols-3">
            {articles.map((a) => (
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
        </section>
      )}

      {/* Location */}
      <section className="container-x mt-20">
        <div className="card grid overflow-hidden lg:grid-cols-[1fr_1.2fr]">
          <div className="p-8 sm:p-10">
            <p className="eyebrow mb-3">Onde estamos</p>
            <h2 className="text-3xl font-semibold text-pine-900">Fácil de chegar, fácil de estacionar</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span>Av. Ibirapuera, 2.500 · Moema, São Paulo - SP<br /><span className="text-ink-500">A 400 m da estação Eucaliptos (Linha 5-Lilás). Estacionamento com 320 vagas.</span></span></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span>Segunda a sábado, 6h às 22h</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" /><span>(11) 3045-0010</span></li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={whatsappLink("5511987000010")} target="_blank" rel="noopener" className="btn-primary"><MessageCircle className="h-4 w-4" /> WhatsApp da administração</a>
              <Link href="/contato" className="btn-ghost">Como chegar <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <iframe
            title="Mapa do Vitalis Hub"
            className="min-h-72 w-full border-0 lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Av.+Ibirapuera,+2500,+Moema,+S%C3%A3o+Paulo&output=embed"
          />
        </div>
      </section>
    </>
  );
}
