"use client";

import { useActionState, useState } from "react";
import { login, requestPasswordReset } from "@/lib/actions/admin";
import { Field, SubmitButton } from "@/components/site/form-field";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [state, action, pending] = useActionState(login, null);
  const [resetState, resetAction, resetPending] = useActionState(requestPasswordReset, null);

  if (mode === "reset") {
    return (
      <form action={resetAction} className="mt-6 space-y-4">
        {resetState?.ok ? (
          <p className="rounded-xl bg-pine-50 p-3 text-sm text-pine-800">{resetState.message}</p>
        ) : (
          <Field label="E-mail" name="email"><input id="email" name="email" type="email" className="input" required autoFocus /></Field>
        )}
        <div className="flex items-center justify-between">
          {!resetState?.ok && <SubmitButton pending={resetPending}>Enviar link</SubmitButton>}
          <button type="button" onClick={() => setMode("login")} className="text-sm font-semibold text-pine-700 hover:underline">Voltar ao login</button>
        </div>
      </form>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.message && !state.ok && <p className="rounded-xl bg-coral-50 p-3 text-sm text-coral-700" role="alert">{state.message}</p>}
      <Field label="E-mail" name="email"><input id="email" name="email" type="email" className="input" autoComplete="username" required autoFocus /></Field>
      <Field label="Senha" name="password"><input id="password" name="password" type="password" className="input" autoComplete="current-password" required /></Field>
      <div className="flex items-center justify-between">
        <SubmitButton pending={pending}>Entrar</SubmitButton>
        <button type="button" onClick={() => setMode("reset")} className="text-sm font-semibold text-pine-700 hover:underline">Esqueci a senha</button>
      </div>
    </form>
  );
}
