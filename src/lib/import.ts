import "server-only";
import * as XLSX from "xlsx";
import { prisma } from "./prisma";
import { slugify } from "./utils";

export type ImportKind = "empresas" | "profissionais";

const templates: Record<ImportKind, { columns: string[]; example: Record<string, string> }> = {
  empresas: {
    columns: ["id_externo", "nome", "categoria", "especialidades", "sala", "andar", "horarios", "telefone", "whatsapp", "instagram", "site", "descricao"],
    example: {
      id_externo: "EMP-101", nome: "Clínica Exemplo", categoria: "clinicas-medicas", especialidades: "Cardiologia; Clínica Geral",
      sala: "705", andar: "7", horarios: "Seg a Sex 8h às 18h", telefone: "(11) 3000-0000", whatsapp: "5511900000000",
      instagram: "clinicaexemplo", site: "https://exemplo.com.br", descricao: "Descrição curta da clínica.",
    },
  },
  profissionais: {
    columns: ["id_externo", "nome", "conselho", "registro", "uf", "especialidades", "empresas", "bio"],
    example: {
      id_externo: "PRO-101", nome: "Dr. Nome Sobrenome", conselho: "CRM", registro: "123.456", uf: "SP",
      especialidades: "Cardiologia", empresas: "EMP-001; EMP-002", bio: "Breve apresentação.",
    },
  },
};

type RowIssue = { level: "error" | "warning"; message: string };
type PreviewRow = { line: number; data: Record<string, string>; issues: RowIssue[]; status: "ok" | "warning" | "error" | "duplicate" };
export type Preview = { kind: ImportKind; filename: string; rows: PreviewRow[]; summary: { total: number; ok: number; warnings: number; errors: number; duplicates: number } };

export function buildTemplate(kind: ImportKind) {
  const t = templates[kind];
  const ws = XLSX.utils.json_to_sheet([t.example], { header: t.columns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, kind);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

function readRows(buffer: ArrayBuffer): Record<string, string>[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  return raw.map((r) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) out[String(k).trim().toLowerCase()] = String(v ?? "").trim();
    return out;
  });
}

const splitList = (s: string) => s.split(/[;|,]/).map((x) => x.trim()).filter(Boolean);

export async function buildPreview(kind: ImportKind, filename: string, buffer: ArrayBuffer): Promise<Preview> {
  const rows = readRows(buffer);
  const t = templates[kind];
  const preview: PreviewRow[] = [];

  const [categories, specialties, existingCompanies, existingPros] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, name: true } }),
    prisma.specialty.findMany({ select: { name: true, slug: true } }),
    prisma.company.findMany({ select: { externalId: true, name: true } }),
    prisma.professional.findMany({ select: { externalId: true, name: true } }),
  ]);
  const catSet = new Map(categories.flatMap((c) => [[c.slug, c.slug], [slugify(c.name), c.slug]]));
  const specSet = new Set(specialties.map((s) => s.slug));
  const existing = kind === "empresas" ? existingCompanies : existingPros;
  const existingIds = new Set(existing.map((e) => e.externalId));
  const existingNames = new Set(existing.map((e) => slugify(e.name)));
  const companyIds = new Set(existingCompanies.map((c) => c.externalId));
  const seenIds = new Set<string>();

  rows.forEach((data, i) => {
    const issues: RowIssue[] = [];
    const line = i + 2; // header is line 1
    for (const col of t.columns) if (!(col in data)) data[col] = "";

    const id = data.id_externo;
    if (!id) issues.push({ level: "error", message: "id_externo vazio" });
    if (!data.nome) issues.push({ level: "error", message: "nome vazio" });
    let duplicate = false;
    if (id && existingIds.has(id)) { issues.push({ level: "error", message: `id_externo ${id} já cadastrado (registro será ignorado, não sobrescrito)` }); duplicate = true; }
    if (id && seenIds.has(id)) { issues.push({ level: "error", message: `id_externo ${id} repetido na planilha` }); duplicate = true; }
    if (id) seenIds.add(id);
    if (data.nome && existingNames.has(slugify(data.nome))) issues.push({ level: "warning", message: "possível duplicidade: já existe um registro com este nome" });

    const specs = splitList(data.especialidades);
    for (const s of specs) if (!specSet.has(slugify(s))) issues.push({ level: "warning", message: `especialidade "${s}" não existe e será criada` });

    if (kind === "empresas") {
      if (!catSet.has(slugify(data.categoria))) issues.push({ level: "error", message: `categoria "${data.categoria}" não encontrada` });
      if (!data.sala) issues.push({ level: "error", message: "sala vazia" });
      if (data.andar === "" || Number.isNaN(Number(data.andar))) issues.push({ level: "error", message: "andar deve ser um número" });
      if (!data.telefone && !data.whatsapp) issues.push({ level: "warning", message: "sem telefone e sem WhatsApp" });
    } else {
      if (!data.conselho) issues.push({ level: "error", message: "conselho vazio" });
      if (!data.registro) issues.push({ level: "error", message: "registro vazio" });
      if (!/^[A-Z]{2}$/.test(data.uf.toUpperCase())) issues.push({ level: "error", message: "UF inválida" });
      const links = splitList(data.empresas);
      if (links.length === 0) issues.push({ level: "warning", message: "sem vínculo com empresas" });
      for (const l of links) if (!companyIds.has(l)) issues.push({ level: "error", message: `empresa ${l} não encontrada para vínculo` });
    }

    const status = duplicate ? "duplicate" : issues.some((x) => x.level === "error") ? "error" : issues.length ? "warning" : "ok";
    preview.push({ line, data, issues, status });
  });

  const summary = {
    total: preview.length,
    ok: preview.filter((r) => r.status === "ok").length,
    warnings: preview.filter((r) => r.status === "warning").length,
    errors: preview.filter((r) => r.status === "error").length,
    duplicates: preview.filter((r) => r.status === "duplicate").length,
  };
  return { kind, filename, rows: preview, summary };
}

/** Inserts only rows with status ok/warning. Never updates existing records. */
export async function commitPreview(preview: Preview, userName: string) {
  const insertable = preview.rows.filter((r) => r.status === "ok" || r.status === "warning");
  const categories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const catId = (v: string) => categories.find((c) => c.slug === slugify(v) || slugify(c.name) === slugify(v))?.id;
  let inserted = 0;
  const failures: { line: number; message: string }[] = [];

  for (const row of insertable) {
    const d = row.data;
    try {
      const specs = splitList(d.especialidades);
      const specConnect = [];
      for (const s of specs) {
        const slug = slugify(s);
        const sp = await prisma.specialty.upsert({ where: { slug }, create: { name: s, slug }, update: {} });
        specConnect.push({ id: sp.id });
      }
      const baseSlug = slugify(d.nome);
      const slug = `${baseSlug}-${d.id_externo.toLowerCase()}`;
      if (preview.kind === "empresas") {
        await prisma.company.create({
          data: {
            externalId: d.id_externo, name: d.nome, slug, description: d.descricao || d.nome,
            categoryId: catId(d.categoria)!, specialties: { connect: specConnect },
            room: d.sala, floor: Number(d.andar), hours: d.horarios || "A confirmar",
            phone: d.telefone, whatsapp: d.whatsapp, instagram: d.instagram || null, website: d.site || null,
            photos: [], active: true,
          },
        });
      } else {
        const links = splitList(d.empresas);
        const companies = await prisma.company.findMany({ where: { externalId: { in: links } }, select: { id: true } });
        await prisma.professional.create({
          data: {
            externalId: d.id_externo, name: d.nome, slug, council: d.conselho.toUpperCase(), registration: d.registro, uf: d.uf.toUpperCase(),
            bio: d.bio || null, active: true, specialties: { connect: specConnect },
            companies: { create: companies.map((c) => ({ companyId: c.id })) },
          },
        });
      }
      inserted++;
    } catch (e) {
      failures.push({ line: row.line, message: e instanceof Error ? e.message.split("\n")[0] : "erro desconhecido" });
    }
  }

  const batch = await prisma.importBatch.create({
    data: {
      filename: preview.filename, kind: preview.kind, total: preview.summary.total, inserted,
      skipped: preview.summary.total - inserted,
      report: {
        errors: preview.rows.filter((r) => r.status === "error").map((r) => ({ line: r.line, messages: r.issues.map((i) => i.message) })),
        duplicates: preview.rows.filter((r) => r.status === "duplicate").map((r) => ({ line: r.line, externalId: r.data.id_externo })),
        failures,
      },
      userName,
    },
  });
  return { inserted, skipped: preview.summary.total - inserted, failures, batchId: batch.id };
}
