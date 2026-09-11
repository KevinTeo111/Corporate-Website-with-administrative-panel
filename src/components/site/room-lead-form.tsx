"use client";

import { useActionState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import { submitRoomLead } from "@/lib/actions/public";
import { Field, Honeypot, SubmitButton } from "./form-field";
import { cn } from "@/lib/utils";

export function RoomLeadForm({ highlighted = false }: { highlighted?: boolean }) {
  const [state, action, pending] = useActionState(submitRoomLead, null);
  const err = state?.errors ?? {};

  if (state?.ok) {
    return (
      <div className="card flex items-start gap-4 p-6 sm:p-8" id="avise-me">
        <CheckCircle2 className="h-8 w-8 shrink-0 text-pine-500" />
        <div>
          <h3 className="text-xl font-semibold text-pine-900">Interesse registrado</h3>
          <p className="mt-1 text-sm text-ink-500">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} id="avise-me" className={cn("card relative scroll-mt-24 p-6 sm:p-8", highlighted && "ring-2 ring-coral-400 shadow-lift")}>
      <Honeypot />
      <div className="mb-6 flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral-100 text-coral-600"><BellRing className="h-5 w-5" /></span>
        <div>
          <h3 className="text-xl font-semibold text-pine-900">Avise-me quando houver uma sala disponível</h3>
          <p className="mt-1 text-sm text-ink-500">Conte o que procura. A administração entra em contato quando surgir uma sala com o seu perfil.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" error={err.name}><input id="name" name="name" className="input" autoComplete="name" required /></Field>
        <Field label="E-mail" name="email" error={err.email}><input id="email" name="email" type="email" className="input" autoComplete="email" required /></Field>
        <Field label="WhatsApp" name="whatsapp" error={err.whatsapp}><input id="whatsapp" name="whatsapp" className="input" placeholder="(11) 99999-9999" autoComplete="tel" required /></Field>
        <Field label="Interesse" name="mode" error={err.mode}>
          <select id="mode" name="mode" className="input" defaultValue="RENT">
            <option value="RENT">Locação</option>
            <option value="SALE">Compra</option>
            <option value="BOTH">Locação ou compra</option>
          </select>
        </Field>
        <Field label="Metragem desejada" name="desiredArea">
          <select id="desiredArea" name="desiredArea" className="input" defaultValue="">
            <option value="">Sem preferência</option>
            <option>Até 30 m²</option>
            <option>30 a 40 m²</option>
            <option>40 a 60 m²</option>
            <option>60 a 90 m²</option>
            <option>Acima de 90 m²</option>
          </select>
        </Field>
        <Field label="Área de atuação" name="activityArea"><input id="activityArea" name="activityArea" className="input" placeholder="Ex.: Dermatologia" /></Field>
        <Field label="Observações" name="notes" className="sm:col-span-2"><textarea id="notes" name="notes" rows={3} className="input" placeholder="Dias de atendimento, andar preferido, número de salas…" /></Field>
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-ink-700">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-sand-300 accent-pine-700" />
        <span>Autorizo o contato da administração do Vitalis Hub por e-mail ou WhatsApp sobre salas disponíveis.</span>
      </label>
      {err.consent && <p className="mt-1 text-xs font-medium text-coral-600" role="alert">{err.consent}</p>}

      <div className="mt-6 flex items-center gap-4">
        <SubmitButton pending={pending}>Quero ser avisado</SubmitButton>
        <p className="text-xs text-ink-300">Seus dados ficam apenas com a administração.</p>
      </div>
    </form>
  );
}
