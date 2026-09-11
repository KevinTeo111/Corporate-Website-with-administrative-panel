export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pine-100 blur-3xl" />
      <div className="container-x relative py-10 sm:py-14">
        <p className="eyebrow mb-3 animate-fade-up">{eyebrow}</p>
        <h1 className="animate-fade-up delay-100 max-w-3xl text-4xl font-semibold leading-tight text-pine-900 sm:text-5xl">{title}</h1>
        {description && <p className="animate-fade-up delay-200 mt-4 max-w-2xl text-lg leading-8 text-ink-500">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="card mt-6 px-6 py-16 text-center">
      <p className="font-display text-2xl text-pine-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{description}</p>
    </div>
  );
}
