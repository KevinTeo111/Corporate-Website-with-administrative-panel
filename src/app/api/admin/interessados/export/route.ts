import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getSessionUser, logAction } from "@/lib/auth";
import { leadWhere } from "@/lib/leads";
import { leadStatusLabel, roomModeLabel } from "@/lib/utils";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const url = new URL(req.url);
  const sp = Object.fromEntries(url.searchParams.entries());
  const leads = await prisma.roomLead.findMany({ where: leadWhere(sp), orderBy: { createdAt: "desc" } });

  const rows = leads.map((l) => ({
    Data: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt),
    Nome: l.name, "E-mail": l.email, WhatsApp: l.whatsapp, Modalidade: roomModeLabel[l.mode],
    "Metragem desejada": l.desiredArea ?? "", "Área de atuação": l.activityArea ?? "", Observações: l.notes ?? "",
    "Autorizou contato": l.consent ? "Sim" : "Não", Status: leadStatusLabel[l.status],
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Interessados");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  await logAction(user, "EXPORT", "RoomLead", `Exportou ${rows.length} interessados`);

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="interessados-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
