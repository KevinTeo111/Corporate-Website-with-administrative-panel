"use client";

import type { Ad } from "@prisma/client";
import { Table, Th, Td, Toggle, Badge } from "./ui";
import { toggleAdActive } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export function AdTable({ ads }: { ads: Ad[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Anunciante</Th><Th>Grupo</Th><Th>Posição</Th><Th>Período</Th><Th>Cliques</Th><Th>Ativo</Th></tr></thead>
      <tbody className="divide-y divide-sand-200">
        {ads.map((a) => (
          <tr key={a.id} className={a.active ? "" : "opacity-60"}>
            <Td>
              <div className="flex items-center gap-3">
                <img src={a.imageMobile} alt="" className="h-10 w-20 rounded-lg object-cover" />
                <div><p className="font-semibold text-ink-900">{a.advertiser}</p><a href={a.link} target="_blank" rel="noopener" className="text-xs text-pine-700 hover:underline">{a.link}</a></div>
              </div>
            </Td>
            <Td><Badge tone={a.group === "HOME" ? "info" : "neutral"}>{a.group === "HOME" ? "Home" : "Diretórios"}</Badge></Td>
            <Td className="text-ink-700">{a.position}</Td>
            <Td className="whitespace-nowrap text-xs text-ink-500">{a.startsAt ? formatDate(a.startsAt) : "início livre"} → {a.endsAt ? formatDate(a.endsAt) : "sem fim"}</Td>
            <Td className="font-display text-lg font-semibold text-ink-900">{a.clicks}</Td>
            <Td><Toggle checked={a.active} label={`Ativar anúncio ${a.advertiser}`} onChange={(v) => toggleAdActive(a.id, v)} /></Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
