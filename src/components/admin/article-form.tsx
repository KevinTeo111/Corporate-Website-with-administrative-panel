"use client";

import Link from "next/link";
import { useActionState } from "react";
import { upsertArticle } from "@/lib/actions/admin";
import { Field, SubmitButton } from "@/components/site/form-field";

type Values = { id?: string; title?: string; excerpt?: string; coverUrl?: string | null; body?: string; author?: string; category?: string; status?: string };

export function ArticleForm({ values }: { values: Values }) {
  const [state, action, pending] = useActionState(upsertArticle, null);
  const err = state?.errors ?? {};
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <div className="card space-y-4 p-6">
        <Field label="Título" name="title" error={err.title}><input id="title" name="title" defaultValue={values.title} className="input text-lg font-semibold" required /></Field>
        <Field label="Resumo" name="excerpt"><textarea id="excerpt" name="excerpt" rows={2} defaultValue={values.excerpt} className="input" /></Field>
        <Field label="Texto" name="body" error={err.body} hint="Parágrafos separados por linha em branco. Linhas iniciadas com ## viram subtítulos."><textarea id="body" name="body" rows={18} defaultValue={values.body} className="input font-mono text-[13px] leading-6" required /></Field>
      </div>
      <aside className="card h-fit space-y-4 p-6">
        <Field label="Status" name="status">
          <select id="status" name="status" defaultValue={values.status ?? "DRAFT"} className="input">
            <option value="DRAFT">Rascunho</option><option value="PUBLISHED">Publicado</option><option value="ARCHIVED">Retirado</option>
          </select>
        </Field>
        <Field label="Categoria" name="category"><input id="category" name="category" defaultValue={values.category} className="input" placeholder="Cardiologia" /></Field>
        <Field label="Autoria" name="author"><input id="author" name="author" defaultValue={values.author} className="input" /></Field>
        <Field label="URL da imagem de capa" name="coverUrl"><input id="coverUrl" name="coverUrl" defaultValue={values.coverUrl ?? ""} className="input" placeholder="https://" /></Field>
        <div className="flex gap-2 pt-2">
          <SubmitButton pending={pending}>Salvar</SubmitButton>
          <Link href="/admin/blog" className="btn-ghost">Cancelar</Link>
        </div>
      </aside>
    </form>
  );
}
