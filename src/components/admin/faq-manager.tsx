"use client";

import { useActionState, useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Pencil, Check, X } from "lucide-react";
import type { Faq } from "@prisma/client";
import { createFaq, updateFaq, deleteFaq, moveFaq } from "@/lib/actions/admin";
import { Toggle } from "./ui";
import { Field, SubmitButton } from "@/components/site/form-field";
import { cn } from "@/lib/utils";

function FaqRow({ faq, first, last }: { faq: Faq; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [pending, start] = useTransition();

  return (
    <li className={cn("flex gap-3 p-4", !faq.active && "opacity-60")}>
      <div className="flex flex-col gap-1">
        <button type="button" disabled={first || pending} aria-label="Subir" onClick={() => start(() => moveFaq(faq.id, -1))} className="grid h-7 w-7 place-items-center rounded-lg ring-1 ring-sand-300 hover:bg-sand-50 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
        <button type="button" disabled={last || pending} aria-label="Descer" onClick={() => start(() => moveFaq(faq.id, 1))} className="grid h-7 w-7 place-items-center rounded-lg ring-1 ring-sand-300 hover:bg-sand-50 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
      </div>
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="space-y-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} className="input font-semibold" aria-label="Pergunta" />
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} className="input" aria-label="Resposta" />
            <div className="flex gap-2">
              <button type="button" disabled={pending} onClick={() => start(async () => { await updateFaq(faq.id, { question, answer }); setEditing(false); })} className="btn-primary btn-sm"><Check className="h-3.5 w-3.5" /> Salvar</button>
              <button type="button" onClick={() => { setQuestion(faq.question); setAnswer(faq.answer); setEditing(false); }} className="btn-ghost btn-sm"><X className="h-3.5 w-3.5" /> Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <p className="font-semibold text-ink-900">{faq.question}</p>
            <p className="mt-1 text-sm text-ink-500">{faq.answer}</p>
          </>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Toggle checked={faq.active} label={`Ativar '${faq.question}'`} onChange={(v) => updateFaq(faq.id, { active: v })} />
        <div className="flex gap-1">
          <button type="button" aria-label="Editar" onClick={() => setEditing(true)} className="grid h-7 w-7 place-items-center rounded-lg ring-1 ring-sand-300 hover:bg-sand-50"><Pencil className="h-3.5 w-3.5" /></button>
          <button type="button" aria-label="Excluir" disabled={pending} onClick={() => { if (confirm("Excluir esta pergunta?")) start(() => deleteFaq(faq.id)); }} className="grid h-7 w-7 place-items-center rounded-lg ring-1 ring-coral-200 text-coral-600 hover:bg-coral-50"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </li>
  );
}

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [state, action, pending] = useActionState(createFaq, null);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="card divide-y divide-sand-200">
        {faqs.map((f, i) => <FaqRow key={f.id} faq={f} first={i === 0} last={i === faqs.length - 1} />)}
        {faqs.length === 0 && <li className="p-10 text-center text-sm text-ink-500">Nenhuma pergunta cadastrada.</li>}
      </ul>
      <form action={action} key={state?.ok ? String(Date.now()) : "form"} className="card h-fit space-y-4 p-6">
        <h2 className="font-sans text-base font-bold text-ink-900">Nova pergunta</h2>
        {state?.message && <p className={cn("rounded-lg p-3 text-sm", state.ok ? "bg-pine-50 text-pine-800" : "bg-coral-50 text-coral-700")}>{state.message}</p>}
        <Field label="Pergunta" name="question"><input id="question" name="question" className="input" required /></Field>
        <Field label="Resposta" name="answer"><textarea id="answer" name="answer" rows={4} className="input" required /></Field>
        <SubmitButton pending={pending}>Adicionar</SubmitButton>
      </form>
    </div>
  );
}
