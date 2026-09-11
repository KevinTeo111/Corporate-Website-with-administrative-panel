"use client";

import { useTransition } from "react";
import type { RoomLead, LeadStatus } from "@prisma/client";
import { Table, Th, Td } from "./ui";
import { setLeadStatus } from "@/lib/actions/admin";
import { cn, formatDateTime, roomModeLabel, whatsappLink } from "@/lib/utils";

const tones: Record<LeadStatus, string> = { NEW: "bg-sky-100 text-sky-800", CONTACTED: "bg-amber-100 text-amber-800", CLOSED: "bg-sand-100 text-ink-700" };

function StatusSelect({ lead }: { lead: RoomLead }) {
  const [pending, start] = useTransition();
  return (
    <select
      value={lead.status}
      disabled={pending}
      onChange={(e) => start(async () => { await setLeadStatus(lead.id, e.target.value as LeadStatus); })}
      className={cn("cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", tones[lead.status], pending && "opacity-60")}
      aria-label={`Status de ${lead.name}`}
    >
      <option value="NEW">Novo</option><option value="CONTACTED">Contatado</option><option value="CLOSED">Encerrado</option>
    </select>
  );
}

export function LeadTable({ leads }: { leads: RoomLead[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50">
        <tr><Th>Data</Th><Th>Interessado</Th><Th>Contato</Th><Th>Interesse</Th><Th>Observações</Th><Th>Status</Th></tr>
      </thead>
      <tbody className="divide-y divide-sand-200">
        {leads.map((l) => (
          <tr key={l.id}>
            <Td className="whitespace-nowrap text-xs text-ink-500">{formatDateTime(l.createdAt)}</Td>
            <Td><p className="font-semibold text-ink-900">{l.name}</p><p className="text-xs text-ink-500">{l.activityArea ?? "área não informada"}</p></Td>
            <Td className="text-xs">
              <a href={`mailto:${l.email}`} className="block text-pine-700 hover:underline">{l.email}</a>
              <a href={whatsappLink(l.whatsapp)} target="_blank" rel="noopener" className="block text-pine-700 hover:underline">{l.whatsapp}</a>
              {!l.consent && <span className="text-coral-600">sem autorização de contato</span>}
            </Td>
            <Td className="text-xs text-ink-700"><p>{roomModeLabel[l.mode]}</p><p className="text-ink-500">{l.desiredArea ?? "metragem livre"}</p></Td>
            <Td className="max-w-64 text-xs text-ink-500">{l.notes ?? "—"}</Td>
            <Td><StatusSelect lead={l} /></Td>
          </tr>
        ))}
        {leads.length === 0 && <tr><Td className="py-10 text-center text-ink-500">Nenhum interessado no período.</Td></tr>}
      </tbody>
    </Table>
  );
}
