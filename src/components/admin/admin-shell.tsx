"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Building2, Users, DoorOpen, Inbox, FileSpreadsheet, Megaphone, Newspaper, HelpCircle, Images, History, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { logout } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

const groups = [
  { title: "Visão geral", items: [{ href: "/admin", label: "Painel", icon: LayoutDashboard }] },
  {
    title: "Diretório",
    items: [
      { href: "/admin/empresas", label: "Empresas", icon: Building2 },
      { href: "/admin/profissionais", label: "Profissionais", icon: Users },
      { href: "/admin/importacao", label: "Importação", icon: FileSpreadsheet },
    ],
  },
  {
    title: "Salas",
    items: [
      { href: "/admin/salas", label: "Salas", icon: DoorOpen },
      { href: "/admin/interessados", label: "Interessados", icon: Inbox },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      { href: "/admin/banners", label: "Banners da home", icon: Images },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/publicidade", label: "Publicidade", icon: Megaphone },
    ],
  },
  { title: "Sistema", items: [{ href: "/admin/historico", label: "Histórico", icon: History }] },
];

export function AdminShell({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-pine-300/70">{g.title}</p>
          {g.items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition", active ? "bg-white/10 text-white" : "text-pine-100/70 hover:bg-white/5 hover:text-white")}>
                <item.icon className={cn("h-4 w-4", active ? "text-coral-400" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-sand-100">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-pine-950 lg:flex">
        <div className="px-5 py-5"><Logo light /></div>
        {nav}
        <UserBox user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-72 flex-col bg-pine-950">
            <div className="flex items-center justify-between px-5 py-4"><Logo light /><button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="text-white"><X className="h-5 w-5" /></button></div>
            {nav}
            <UserBox user={user} />
          </div>
          <button type="button" aria-label="Fechar" className="flex-1 bg-pine-950/60" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sand-300 bg-sand-50/90 px-4 backdrop-blur lg:px-8">
          <button type="button" onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-sand-300 lg:hidden" aria-label="Abrir menu"><Menu className="h-4 w-4" /></button>
          <p className="hidden text-sm text-ink-500 lg:block">Painel administrativo</p>
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700 hover:underline">Ver site <ExternalLink className="h-3.5 w-3.5" /></Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function UserBox({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="border-t border-white/10 p-4">
      <p className="truncate text-sm font-semibold text-white">{user.name}</p>
      <p className="truncate text-xs text-pine-300/70">{user.email}</p>
      <form action={logout} className="mt-3">
        <button type="submit" className="inline-flex items-center gap-2 text-xs font-semibold text-pine-200 hover:text-white"><LogOut className="h-3.5 w-3.5" /> Sair</button>
      </form>
    </div>
  );
}
