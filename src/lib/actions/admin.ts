"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, logAction, requireUser, verifyPassword } from "@/lib/auth";
import { buildPreview, commitPreview, type ImportKind, type Preview } from "@/lib/import";
import { slugify } from "@/lib/utils";
import { ArticleStatus, LeadStatus } from "@prisma/client";
import type { FormState } from "./public";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- Auth ----------

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, message: "E-mail ou senha incorretos." };
  }
  await createSession(user.id);
  await logAction(user, "LOGIN", "Session", "Acesso ao painel");
  redirect("/admin");
}

export async function logout() {
  const user = await requireUser().catch(() => null);
  if (user) await logAction(user, "LOGOUT", "Session");
  await destroySession();
  redirect("/admin/login");
}

export async function requestPasswordReset(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const user = await prisma.adminUser.findUnique({ where: { email } });
  // In production a signed, expiring link is e-mailed here. The demo only logs it.
  if (user) console.log(`[recuperação de senha] link enviado para ${email}`);
  return { ok: true, message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha." };
}

// ---------- Companies ----------

export async function toggleCompanyField(id: string, field: "active" | "featured", value: boolean) {
  const user = await requireUser();
  const c = await prisma.company.update({ where: { id }, data: { [field]: value }, select: { name: true } });
  await logAction(user, "UPDATE", "Company", `${field === "active" ? (value ? "Ativou" : "Desativou") : value ? "Destacou" : "Removeu destaque de"} ${c.name}`, id);
  revalidateAll();
}

export async function upsertCompany(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Informe o nome.";
  if (!str(fd, "categoryId")) errors.categoryId = "Escolha a categoria.";
  if (!str(fd, "room")) errors.room = "Informe a sala.";
  if (Number.isNaN(Number(str(fd, "floor")))) errors.floor = "Andar inválido.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const specialtyIds = fd.getAll("specialtyIds").map(String);
  const photos = str(fd, "photos").split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const data = {
    name,
    description: str(fd, "description") || name,
    categoryId: str(fd, "categoryId"),
    room: str(fd, "room"),
    floor: Number(str(fd, "floor")),
    hours: str(fd, "hours") || "A confirmar",
    phone: str(fd, "phone"),
    whatsapp: str(fd, "whatsapp"),
    instagram: str(fd, "instagram") || null,
    website: str(fd, "website") || null,
    logoUrl: str(fd, "logoUrl") || null,
    photos,
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    specialties: { set: specialtyIds.map((sid) => ({ id: sid })) },
  };

  if (id) {
    await prisma.company.update({ where: { id }, data });
    await logAction(user, "UPDATE", "Company", `Editou ${name}`, id);
  } else {
    const externalId = str(fd, "externalId") || `EMP-${Date.now().toString(36).toUpperCase()}`;
    const created = await prisma.company.create({ data: { ...data, externalId, slug: `${slugify(name)}-${externalId.toLowerCase()}`, specialties: { connect: specialtyIds.map((sid) => ({ id: sid })) } } });
    await logAction(user, "CREATE", "Company", `Criou ${name}`, created.id);
  }
  revalidateAll();
  redirect("/admin/empresas");
}

// ---------- Professionals ----------

export async function toggleProfessionalActive(id: string, value: boolean) {
  const user = await requireUser();
  const p = await prisma.professional.update({ where: { id }, data: { active: value }, select: { name: true } });
  await logAction(user, "UPDATE", "Professional", `${value ? "Ativou" : "Desativou"} ${p.name}`, id);
  revalidateAll();
}

export async function upsertProfessional(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Informe o nome.";
  if (!str(fd, "council")) errors.council = "Informe o conselho.";
  if (!str(fd, "registration")) errors.registration = "Informe o registro.";
  if (!/^[A-Za-z]{2}$/.test(str(fd, "uf"))) errors.uf = "UF inválida.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const specialtyIds = fd.getAll("specialtyIds").map(String);
  const companyIds = fd.getAll("companyIds").map(String);
  const base = {
    name,
    council: str(fd, "council").toUpperCase(),
    registration: str(fd, "registration"),
    uf: str(fd, "uf").toUpperCase(),
    bio: str(fd, "bio") || null,
    photoUrl: str(fd, "photoUrl") || null,
    active: bool(fd, "active"),
  };

  if (id) {
    await prisma.$transaction([
      prisma.professionalCompany.deleteMany({ where: { professionalId: id } }),
      prisma.professional.update({
        where: { id },
        data: { ...base, specialties: { set: specialtyIds.map((sid) => ({ id: sid })) }, companies: { create: companyIds.map((cid) => ({ companyId: cid })) } },
      }),
    ]);
    await logAction(user, "UPDATE", "Professional", `Editou ${name}`, id);
  } else {
    const externalId = str(fd, "externalId") || `PRO-${Date.now().toString(36).toUpperCase()}`;
    const created = await prisma.professional.create({
      data: { ...base, externalId, slug: `${slugify(name)}-${externalId.toLowerCase()}`, specialties: { connect: specialtyIds.map((sid) => ({ id: sid })) }, companies: { create: companyIds.map((cid) => ({ companyId: cid })) } },
    });
    await logAction(user, "CREATE", "Professional", `Criou ${name}`, created.id);
  }
  revalidateAll();
  redirect("/admin/profissionais");
}

// ---------- Rooms & leads ----------

export async function toggleRoomAvailable(id: string, value: boolean) {
  const user = await requireUser();
  const r = await prisma.room.update({ where: { id }, data: { available: value }, select: { code: true } });
  await logAction(user, "UPDATE", "Room", `Marcou sala ${r.code} como ${value ? "disponível" : "indisponível"}`, id);
  revalidateAll();
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  const user = await requireUser();
  const l = await prisma.roomLead.update({ where: { id }, data: { status }, select: { name: true } });
  await logAction(user, "UPDATE", "RoomLead", `Alterou status de ${l.name} para ${status}`, id);
  revalidatePath("/admin/interessados");
  revalidatePath("/admin");
}

// ---------- Import ----------

export async function previewImport(_prev: Preview | { error: string } | null, fd: FormData): Promise<Preview | { error: string }> {
  await requireUser();
  const kind = str(fd, "kind") as ImportKind;
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Selecione uma planilha .xlsx ou .csv." };
  if (file.size > 5 * 1024 * 1024) return { error: "A planilha deve ter no máximo 5 MB." };
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) return { error: "Formato não suportado. Use .xlsx ou .csv." };
  try {
    return await buildPreview(kind, file.name, await file.arrayBuffer());
  } catch {
    return { error: "Não foi possível ler a planilha. Confira se ela segue o modelo." };
  }
}

export async function confirmImport(preview: Preview) {
  const user = await requireUser();
  const result = await commitPreview(preview, user.name);
  await logAction(user, "IMPORT", preview.kind === "empresas" ? "Company" : "Professional", `Importou ${result.inserted} de ${preview.summary.total} registros (${preview.filename})`);
  revalidateAll();
  return result;
}

// ---------- Ads, banners ----------

export async function toggleAdActive(id: string, value: boolean) {
  const user = await requireUser();
  const a = await prisma.ad.update({ where: { id }, data: { active: value }, select: { advertiser: true } });
  await logAction(user, "UPDATE", "Ad", `${value ? "Ativou" : "Desativou"} anúncio ${a.advertiser}`, id);
  revalidateAll();
}

export async function toggleBannerActive(id: string, value: boolean) {
  const user = await requireUser();
  const b = await prisma.banner.update({ where: { id }, data: { active: value }, select: { title: true } });
  await logAction(user, "UPDATE", "Banner", `${value ? "Ativou" : "Desativou"} banner ${b.title}`, id);
  revalidateAll();
}

// ---------- Blog ----------

export async function setArticleStatus(id: string, status: ArticleStatus) {
  const user = await requireUser();
  const a = await prisma.article.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined },
    select: { title: true },
  });
  await logAction(user, status === "PUBLISHED" ? "PUBLISH" : "UPDATE", "Article", `${status === "PUBLISHED" ? "Publicou" : status === "ARCHIVED" ? "Retirou" : "Voltou para rascunho"} '${a.title}'`, id);
  revalidateAll();
}

export async function upsertArticle(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id");
  const title = str(fd, "title");
  const errors: Record<string, string> = {};
  if (title.length < 5) errors.title = "Informe o título.";
  if (str(fd, "body").length < 20) errors.body = "O texto está muito curto.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const status = (str(fd, "status") || "DRAFT") as ArticleStatus;
  const data = {
    title,
    excerpt: str(fd, "excerpt") || title,
    coverUrl: str(fd, "coverUrl") || null,
    body: str(fd, "body"),
    author: str(fd, "author") || user.name,
    category: str(fd, "category") || "Geral",
    status,
  };
  if (id) {
    const prev = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
    await prisma.article.update({ where: { id }, data: { ...data, publishedAt: status === "PUBLISHED" ? (prev?.publishedAt ?? new Date()) : prev?.publishedAt } });
    await logAction(user, "UPDATE", "Article", `Editou '${title}'`, id);
  } else {
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const created = await prisma.article.create({ data: { ...data, slug, publishedAt: status === "PUBLISHED" ? new Date() : null } });
    await logAction(user, "CREATE", "Article", `Criou '${title}'`, created.id);
  }
  revalidateAll();
  redirect("/admin/blog");
}

// ---------- FAQ ----------

export async function createFaq(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (question.length < 5 || answer.length < 5) return { ok: false, message: "Preencha pergunta e resposta." };
  const max = await prisma.faq.aggregate({ _max: { order: true } });
  await prisma.faq.create({ data: { question, answer, order: (max._max.order ?? 0) + 1, active: true } });
  await logAction(user, "CREATE", "Faq", `Criou pergunta '${question}'`);
  revalidateAll();
  return { ok: true, message: "Pergunta adicionada." };
}

export async function updateFaq(id: string, data: { question?: string; answer?: string; active?: boolean }) {
  const user = await requireUser();
  await prisma.faq.update({ where: { id }, data });
  await logAction(user, "UPDATE", "Faq", `Atualizou pergunta`, id);
  revalidateAll();
}

export async function deleteFaq(id: string) {
  const user = await requireUser();
  const f = await prisma.faq.delete({ where: { id } });
  await logAction(user, "DELETE", "Faq", `Excluiu pergunta '${f.question}'`, id);
  revalidateAll();
}

export async function moveFaq(id: string, direction: -1 | 1) {
  const user = await requireUser();
  const all = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((f) => f.id === id);
  const swap = idx + direction;
  if (idx < 0 || swap < 0 || swap >= all.length) return;
  await prisma.$transaction([
    prisma.faq.update({ where: { id: all[idx].id }, data: { order: all[swap].order } }),
    prisma.faq.update({ where: { id: all[swap].id }, data: { order: all[idx].order } }),
  ]);
  await logAction(user, "UPDATE", "Faq", "Reordenou perguntas");
  revalidateAll();
}
