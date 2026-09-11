import type { Prisma, LeadStatus, RoomMode } from "@prisma/client";

export type LeadSearch = { status?: string; modalidade?: string; de?: string; ate?: string };

/** Shared by the admin listing and the spreadsheet export so both apply identical filters. */
export function leadWhere(sp: LeadSearch): Prisma.RoomLeadWhereInput {
  const where: Prisma.RoomLeadWhereInput = {};
  if (sp.status) where.status = sp.status as LeadStatus;
  if (sp.modalidade) where.mode = sp.modalidade as RoomMode;
  if (sp.de || sp.ate) {
    where.createdAt = {};
    if (sp.de) where.createdAt.gte = new Date(sp.de);
    if (sp.ate) {
      const d = new Date(sp.ate);
      d.setDate(d.getDate() + 1);
      where.createdAt.lt = d;
    }
  }
  return where;
}
