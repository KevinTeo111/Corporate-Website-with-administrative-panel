"use server";

import { prisma } from "@/lib/prisma";
import { RoomMode } from "@prisma/client";

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string> } | null;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Placeholder for the SMTP notification that the real project sends to the administration. */
async function notifyAdmin(subject: string, body: string) {
  console.log(`[notificação e-mail] ${subject}\n${body}`);
}

export async function submitRoomLead(_prev: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: bots fill hidden fields
  if (str(fd, "website")) return { ok: true, message: "Recebemos seu interesse." };

  const errors: Record<string, string> = {};
  const name = str(fd, "name");
  const email = str(fd, "email");
  const whatsapp = str(fd, "whatsapp");
  const mode = str(fd, "mode");
  const consent = fd.get("consent") === "on";

  if (name.length < 3) errors.name = "Informe seu nome.";
  if (!emailRe.test(email)) errors.email = "Informe um e-mail válido.";
  if (whatsapp.replace(/\D/g, "").length < 10) errors.whatsapp = "Informe um WhatsApp com DDD.";
  if (!["RENT", "SALE", "BOTH"].includes(mode)) errors.mode = "Escolha locação ou compra.";
  if (!consent) errors.consent = "Precisamos da sua autorização para entrar em contato.";
  if (Object.keys(errors).length) return { ok: false, errors };

  await prisma.roomLead.create({
    data: {
      name, email, whatsapp,
      mode: mode as RoomMode,
      desiredArea: str(fd, "desiredArea") || null,
      activityArea: str(fd, "activityArea") || null,
      notes: str(fd, "notes").slice(0, 1000) || null,
      consent,
    },
  });
  await notifyAdmin("Novo interessado em sala", `${name} · ${email} · ${whatsapp}`);
  return { ok: true, message: "Recebemos seu interesse. A administração entra em contato quando houver uma sala com o seu perfil." };
}

export async function submitAdInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true, message: "Mensagem enviada." };

  const errors: Record<string, string> = {};
  const name = str(fd, "name");
  const company = str(fd, "company");
  const email = str(fd, "email");
  const whatsapp = str(fd, "whatsapp");
  const message = str(fd, "message");

  if (name.length < 3) errors.name = "Informe seu nome.";
  if (company.length < 2) errors.company = "Informe a empresa.";
  if (!emailRe.test(email)) errors.email = "Informe um e-mail válido.";
  if (whatsapp.replace(/\D/g, "").length < 10) errors.whatsapp = "Informe um WhatsApp com DDD.";
  if (message.length < 10) errors.message = "Conte um pouco sobre o que quer anunciar.";
  if (Object.keys(errors).length) return { ok: false, errors };

  await prisma.adInquiry.create({ data: { name, company, email, whatsapp, message: message.slice(0, 2000) } });
  await notifyAdmin("Novo pedido de anúncio", `${company} (${name}) · ${email} · ${whatsapp}`);
  return { ok: true, message: "Mensagem enviada. O comercial responde em até um dia útil." };
}
