"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Megaphone } from "lucide-react";
import { Logo } from "./logo";
import { cn, whatsappLink } from "@/lib/utils";

const nav = [
  { href: "/empresas", label: "Empresas" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/servicos", label: "Serviços" },
  { href: "/salas", label: "Salas" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "bg-sand-50/85 shadow-[0_1px_0_0_var(--color-sand-300)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-pine-900" : "text-ink-500 hover:text-pine-900",
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-coral-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/anuncie" className="btn-ghost btn-sm">
            <Megaphone className="h-3.5 w-3.5" /> Anuncie aqui
          </Link>
          <a href={whatsappLink("5511987000010", "Olá! Vim pelo site do Vitalis Hub.")} target="_blank" rel="noopener" className="btn-primary btn-sm">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-sand-300 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sand-300 bg-sand-50 lg:hidden animate-fade-up">
          <nav className="container-x flex flex-col py-3" aria-label="Principal (celular)">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-2 py-3 text-base font-medium text-ink-900 hover:bg-white">
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 pb-2">
              <Link href="/anuncie" className="btn-ghost flex-1">Anuncie aqui</Link>
              <a href={whatsappLink("5511987000010")} className="btn-primary flex-1" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
