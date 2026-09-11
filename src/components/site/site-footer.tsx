import Link from "next/link";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-pine-950 text-pine-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-6 text-pine-200/80">
            Centro de saúde e negócios com clínicas, laboratório, exames de imagem, lojas e serviços em um único endereço.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-pine-300">Navegue</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/empresas", "Empresas"],
              ["/profissionais", "Profissionais"],
              ["/servicos", "Serviços"],
              ["/salas", "Salas"],
              ["/blog", "Blog"],
              ["/faq", "Perguntas frequentes"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-pine-100/80 transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-pine-300">Institucional</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/sobre" className="text-pine-100/80 transition hover:text-white">Sobre o Vitalis Hub</Link></li>
            <li><Link href="/contato" className="text-pine-100/80 transition hover:text-white">Localização e contato</Link></li>
            <li><Link href="/anuncie" className="text-pine-100/80 transition hover:text-white">Anuncie aqui</Link></li>
            <li><Link href="/admin" className="text-pine-100/80 transition hover:text-white">Área administrativa</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-400" /><span>Av. Ibirapuera, 2.500<br />Moema, São Paulo - SP</span></p>
          <p className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral-400" /><span>(11) 3045-0010</span></p>
          <p className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral-400" /><span>Seg a Sáb, 6h às 22h</span></p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-pine-300/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Vitalis Hub. Projeto de demonstração com dados fictícios.</span>
          <span>Agendamentos e reservas são feitos diretamente com cada responsável.</span>
        </div>
      </div>
    </footer>
  );
}
