"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Category, Specialty } from "@prisma/client";
import { upsertCompany } from "@/lib/actions/admin";
import { Field, SubmitButton } from "@/components/site/form-field";

type CompanyValues = {
  id?: string; externalId?: string; name?: string; description?: string; categoryId?: string; specialtyIds?: string[];
  room?: string; floor?: number; hours?: string; phone?: string; whatsapp?: string; instagram?: string | null; website?: string | null;
  logoUrl?: string | null; photos?: string[]; featured?: boolean; active?: boolean;
};

export function CompanyForm({ values, categories, specialties }: { values: CompanyValues; categories: Category[]; specialties: Specialty[] }) {
  const [state, action, pending] = useActionState(upsertCompany, null);
  const err = state?.errors ?? {};
  const selected = new Set(values.specialtyIds ?? []);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-sans text-base font-bold text-ink-900">Dados principais</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome" name="name" error={err.name} className="sm:col-span-2"><input id="name" name="name" defaultValue={values.name} className="input" required /></Field>
            {!values.id && <Field label="Id externo (opcional)" name="externalId" hint="Usado nos vínculos da importação. Gerado automaticamente se vazio."><input id="externalId" name="externalId" className="input" placeholder="EMP-101" /></Field>}
            <Field label="Categoria" name="categoryId" error={err.categoryId}>
              <select id="categoryId" name="categoryId" defaultValue={values.categoryId ?? ""} className="input" required>
                <option value="" disabled>Selecione</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Descrição" name="description" className="sm:col-span-2"><textarea id="description" name="description" rows={4} defaultValue={values.description} className="input" /></Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-sans text-base font-bold text-ink-900">Localização e contato</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Sala" name="room" error={err.room}><input id="room" name="room" defaultValue={values.room} className="input" required /></Field>
            <Field label="Andar" name="floor" error={err.floor} hint="0 = térreo, negativos = subsolo"><input id="floor" name="floor" type="number" defaultValue={values.floor ?? 0} className="input" required /></Field>
            <Field label="Horários" name="hours"><input id="hours" name="hours" defaultValue={values.hours} className="input" placeholder="Seg a Sex 8h às 18h" /></Field>
            <Field label="Telefone" name="phone"><input id="phone" name="phone" defaultValue={values.phone} className="input" /></Field>
            <Field label="WhatsApp" name="whatsapp" hint="Só números, com DDI: 5511999999999"><input id="whatsapp" name="whatsapp" defaultValue={values.whatsapp} className="input" /></Field>
            <Field label="Instagram" name="instagram"><input id="instagram" name="instagram" defaultValue={values.instagram ?? ""} className="input" placeholder="sem @" /></Field>
            <Field label="Site" name="website" className="sm:col-span-3"><input id="website" name="website" defaultValue={values.website ?? ""} className="input" placeholder="https://" /></Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-sans text-base font-bold text-ink-900">Imagens</h2>
          <div className="grid gap-4">
            <Field label="URL do logo" name="logoUrl" hint="No projeto final, o upload é feito aqui e a imagem é otimizada automaticamente."><input id="logoUrl" name="logoUrl" defaultValue={values.logoUrl ?? ""} className="input" placeholder="https://" /></Field>
            <Field label="Fotos (uma URL por linha)" name="photos"><textarea id="photos" name="photos" rows={3} defaultValue={(values.photos ?? []).join("\n")} className="input font-mono text-xs" /></Field>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-3 font-sans text-base font-bold text-ink-900">Publicação</h2>
          <label className="flex items-center gap-3 py-1.5 text-sm"><input type="checkbox" name="active" defaultChecked={values.active ?? true} className="h-4 w-4 accent-pine-700" /> Ativa no site</label>
          <label className="flex items-center gap-3 py-1.5 text-sm"><input type="checkbox" name="featured" defaultChecked={values.featured ?? false} className="h-4 w-4 accent-pine-700" /> Destaque na home</label>
          <div className="mt-4 flex gap-2">
            <SubmitButton pending={pending}>Salvar</SubmitButton>
            <Link href="/admin/empresas" className="btn-ghost">Cancelar</Link>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="mb-3 font-sans text-base font-bold text-ink-900">Especialidades</h2>
          <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
            {specialties.map((s) => (
              <label key={s.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-sand-50">
                <input type="checkbox" name="specialtyIds" value={s.id} defaultChecked={selected.has(s.id)} className="h-4 w-4 accent-pine-700" /> {s.name}
              </label>
            ))}
          </div>
        </section>
      </aside>
    </form>
  );
}
