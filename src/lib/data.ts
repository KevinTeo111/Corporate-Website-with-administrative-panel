import "server-only";
import { Prisma, AdGroup } from "@prisma/client";
import { prisma } from "./prisma";

const PAGE_SIZE = 12;

const companyInclude = {
  category: true,
  specialties: { orderBy: { name: "asc" } },
  professionals: { include: { professional: { select: { id: true, name: true, slug: true, active: true } } } },
} satisfies Prisma.CompanyInclude;

export type CompanyWithRelations = Prisma.CompanyGetPayload<{ include: typeof companyInclude }>;

const professionalInclude = {
  specialties: { orderBy: { name: "asc" } },
  companies: {
    include: { company: { select: { id: true, name: true, slug: true, room: true, floor: true, phone: true, whatsapp: true, active: true } } },
  },
} satisfies Prisma.ProfessionalInclude;

export type ProfessionalWithRelations = Prisma.ProfessionalGetPayload<{ include: typeof professionalInclude }>;

export function getCategories(kind?: "COMPANY" | "SERVICE") {
  return prisma.category.findMany({ where: kind ? { kind } : undefined, orderBy: { order: "asc" } });
}

export function getSpecialties() {
  return prisma.specialty.findMany({ orderBy: { name: "asc" } });
}

export type CompanyFilters = { q?: string; category?: string; specialty?: string; floor?: string; page?: number; kind?: "COMPANY" | "SERVICE" };

export async function getCompanies(f: CompanyFilters) {
  const page = Math.max(1, f.page ?? 1);
  const where: Prisma.CompanyWhereInput = {
    active: true,
    ...(f.kind ? { category: { kind: f.kind } } : {}),
    ...(f.category ? { category: { slug: f.category } } : {}),
    ...(f.specialty ? { specialties: { some: { slug: f.specialty } } } : {}),
    ...(f.floor !== undefined && f.floor !== "" ? { floor: Number(f.floor) } : {}),
    ...(f.q
      ? {
          OR: [
            { name: { contains: f.q, mode: "insensitive" } },
            { description: { contains: f.q, mode: "insensitive" } },
            { specialties: { some: { name: { contains: f.q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.company.findMany({ where, include: companyInclude, orderBy: [{ featured: "desc" }, { name: "asc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.company.count({ where }),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getFeaturedCompanies(take = 6) {
  return prisma.company.findMany({ where: { active: true, featured: true }, include: companyInclude, orderBy: { name: "asc" }, take });
}

export function getActiveCompaniesLite() {
  return prisma.company.findMany({ where: { active: true }, select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } });
}

export type ProfessionalFilters = { q?: string; specialty?: string; company?: string; page?: number };

export async function getProfessionals(f: ProfessionalFilters) {
  const page = Math.max(1, f.page ?? 1);
  const where: Prisma.ProfessionalWhereInput = {
    active: true,
    ...(f.specialty ? { specialties: { some: { slug: f.specialty } } } : {}),
    ...(f.company ? { companies: { some: { company: { slug: f.company } } } } : {}),
    ...(f.q
      ? {
          OR: [
            { name: { contains: f.q, mode: "insensitive" } },
            { specialties: { some: { name: { contains: f.q, mode: "insensitive" } } } },
            { companies: { some: { company: { name: { contains: f.q, mode: "insensitive" } } } } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.professional.findMany({ where, include: professionalInclude, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.professional.count({ where }),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFloorMap() {
  const companies = await prisma.company.findMany({
    where: { active: true },
    select: { id: true, name: true, slug: true, room: true, floor: true, category: { select: { name: true, kind: true, icon: true } } },
    orderBy: [{ floor: "desc" }, { room: "asc" }],
  });
  const map = new Map<number, typeof companies>();
  for (const c of companies) {
    if (!map.has(c.floor)) map.set(c.floor, []);
    map.get(c.floor)!.push(c);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([floor, list]) => ({ floor, companies: list }));
}

export function getRooms(onlyAvailable = false) {
  return prisma.room.findMany({ where: onlyAvailable ? { available: true } : undefined, orderBy: [{ available: "desc" }, { floor: "desc" }] });
}

export function getPublishedArticles(take?: number) {
  return prisma.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export function getFaqs() {
  return prisma.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export function getBanners() {
  return prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

/** One random active ad for a slot, honouring start/end dates. */
export async function pickAd(group: AdGroup, position = 1) {
  const now = new Date();
  const ads = await prisma.ad.findMany({
    where: {
      group,
      position,
      active: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
  });
  if (ads.length === 0) return null;
  return ads[Math.floor(Math.random() * ads.length)];
}

export async function getSiteStats() {
  const [companies, professionals, specialties, floors] = await Promise.all([
    prisma.company.count({ where: { active: true } }),
    prisma.professional.count({ where: { active: true } }),
    prisma.specialty.count(),
    prisma.company.findMany({ where: { active: true }, distinct: ["floor"], select: { floor: true } }),
  ]);
  return { companies, professionals, specialties, floors: floors.length };
}
