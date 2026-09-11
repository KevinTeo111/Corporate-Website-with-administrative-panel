import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/site/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Acesso administrativo" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-pine-900 lg:block">
        <img src="https://picsum.photos/seed/admin-login/1200/1600" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Logo light />
          <div>
            <p className="font-display text-4xl font-semibold leading-tight">Painel da administração</p>
            <p className="mt-3 max-w-md text-pine-100/80">Empresas, profissionais, salas, interessados, blog, FAQ e publicidade em um só lugar. Cada ação fica registrada com usuário e data.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-semibold text-pine-900">Entrar</h1>
          <p className="mt-1 text-sm text-ink-500">Use sua conta individual da administração.</p>
          <LoginForm />
          <p className="mt-6 rounded-xl bg-sand-100 p-3 text-xs text-ink-500">
            Demonstração: <span className="font-mono">admin@vitalishub.com.br</span> / <span className="font-mono">demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
