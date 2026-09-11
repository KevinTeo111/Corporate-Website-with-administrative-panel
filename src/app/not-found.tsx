import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="eyebrow mb-3">Erro 404</p>
        <h1 className="text-4xl font-semibold text-pine-900">Página não encontrada</h1>
        <p className="mt-3 text-ink-500">O endereço pode ter mudado ou o conteúdo foi retirado.</p>
        <Link href="/" className="btn-primary mt-6">Voltar para a home</Link>
      </div>
    </div>
  );
}
