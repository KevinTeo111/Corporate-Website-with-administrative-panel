"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Specialty } from "@prisma/client";
import { upsertProfessional } from "@/lib/actions/admin";
import { Field, SubmitButton } from "@/components/site/form-field";

type Values = { id?: string; name?: string; council?: string; registration?: string; uf?: string; bio?: string | null; photoUrl?: string | null; active?: boolean; specialtyIds?: string[]; companyIds?: string[] };
type CompanyLite = { id: string; name: string; room: string; active: boolean };

export function ProfessionalForm({ values, specialties, companies }: { values: Values; specialties: Specialty[]; companies: CompanyLite[] }) {
  const [state, action, pending] = useActionState(upsertProfessional, null);
  const err = state?.errors ?? {};
  const specs = new Set(values.specialtyIds ?? []);
  const comps = new Set(values.companyIds ?? []);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-sans text-base font-bold text-ink-900">Dados do profissional</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nome" name="name" error={err.name} className="sm:col-span-3"><input id="name" name="name" defaultValue={values.name} className="input" required /></Field>
            {!values.id && <Field label="Id externo (opcional)" name="externalId" className="sm:col-span-3"><input id="externalId" name="externalId" className="input" placeholder="PRO-101" /></Field>}
            <Field label="Conselho" name="council" error={err.council}><input id="council" name="council" defaultValue={values.council} className="input" placeholder="CRM, CRO, CRP…" required /></Field>
            <Field label="Registro" name="registration" error={err.registration}><input id="registration" name="registration" defaultValue={values.registration} className="input" required /></Field>
            <Field label="UF" name="uf" error={err.uf}><input id="uf" name="uf" defaultValue={values.uf} maxLength={2} className="input uppercase" required /></Field>
            <Field label="Apresentação" name="bio" className="sm:col-span-3"><textarea id="bio" name="bio" rows={3} defaultValue={values.bio ?? ""} className="input" /></Field>
            <Field label="URL da foto" name="photoUrl" className="sm:col-span-3"><input id="photoUrl" name="photoUrl" defaultValue={values.photoUrl ?? ""} className="input" placeholder="https://" /></Field>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="mb-1 font-sans text-base font-bold text-ink-900">Empresas onde atende</h2>
          <p className="mb-4 text-xs text-ink-500">A sala, o andar e o contato de cada local vêm do cadastro da empresa.</p>
          <div className="grid gap-1 sm:grid-cols-2">
            {companies.map((c) => (
              <label key={c.id} className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-sand-50 ${c.active ? "" : "opacity-60"}`}>
                <input type="checkbox" name="companyIds" value={c.id} defaultChecked={comps.has(c.id)} className="h-4 w-4 accent-pine-700" />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="text-xs text-ink-500">Sala {c.room}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
      <aside className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-3 font-sans text-base font-bold text-ink-900">Publicação</h2>
          <label className="flex items-center gap-3 py-1.5 text-sm"><input type="checkbox" name="active" defaultChecked={values.active ?? true} className="h-4 w-4 accent-pine-700" /> Ativo no site</label>
          <div className="mt-4 flex gap-2">
            <SubmitButton pending={pending}>Salvar</SubmitButton>
            <Link href="/admin/profissionais" className="btn-ghost">Cancelar</Link>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="mb-3 font-sans text-base font-bold text-ink-900">Especialidades</h2>
          <div className="max-h-96 space-y-1 overflow-y-auto pr-1">
            {specialties.map((s) => (
              <label key={s.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-sand-50">
                <input type="checkbox" name="specialtyIds" value={s.id} defaultChecked={specs.has(s.id)} className="h-4 w-4 accent-pine-700" /> {s.name}
              </label>
            ))}
          </div>
        </section>
      </aside>
    </form>
  );
}
