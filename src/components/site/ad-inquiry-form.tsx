"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitAdInquiry } from "@/lib/actions/public";
import { Field, Honeypot, SubmitButton } from "./form-field";

export function AdInquiryForm() {
  const [state, action, pending] = useActionState(submitAdInquiry, null);
  const err = state?.errors ?? {};

  if (state?.ok) {
    return (
      <div className="card flex items-start gap-4 p-6 sm:p-8">
        <CheckCircle2 className="h-8 w-8 shrink-0 text-pine-500" />
        <div>
          <h3 className="text-xl font-semibold text-pine-900">Mensagem enviada</h3>
          <p className="mt-1 text-sm text-ink-500">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card relative p-6 sm:p-8">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" error={err.name}><input id="name" name="name" className="input" required /></Field>
        <Field label="Empresa" name="company" error={err.company}><input id="company" name="company" className="input" required /></Field>
        <Field label="E-mail" name="email" error={err.email}><input id="email" name="email" type="email" className="input" required /></Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp}><input id="whatsapp" name="whatsapp" className="input" placeholder="(11) 99999-9999" required /></Field>
        <Field label="Mensagem" name="message" error={err.message} className="sm:col-span-2" hint="Onde quer anunciar (home ou diretórios), por quanto tempo e o que divulga.">
          <textarea id="message" name="message" rows={4} className="input" required />
        </Field>
      </div>
      <div className="mt-6"><SubmitButton pending={pending}>Enviar pedido</SubmitButton></div>
    </form>
  );
}
