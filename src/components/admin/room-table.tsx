"use client";

import type { Room } from "@prisma/client";
import { Table, Th, Td, Toggle, Badge } from "./ui";
import { toggleRoomAvailable } from "@/lib/actions/admin";
import { roomModeLabel } from "@/lib/utils";

export function RoomTable({ rooms }: { rooms: Room[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50">
        <tr><Th>Sala</Th><Th>Andar</Th><Th>Metragem</Th><Th>Modalidade</Th><Th>Características</Th><Th>Disponível</Th></tr>
      </thead>
      <tbody className="divide-y divide-sand-200">
        {rooms.map((r) => (
          <tr key={r.id}>
            <Td>
              <div className="flex items-center gap-3">
                <img src={r.photos[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                <div><p className="font-semibold text-ink-900">{r.title}</p><p className="text-xs text-ink-500">{r.code}</p></div>
              </div>
            </Td>
            <Td className="text-ink-700">{r.floor}º</Td>
            <Td className="text-ink-700">{r.areaM2} m²</Td>
            <Td><Badge>{roomModeLabel[r.mode]}</Badge></Td>
            <Td className="max-w-64 truncate text-xs text-ink-500">{r.features.join(" · ")}</Td>
            <Td><Toggle checked={r.available} label={`Disponibilidade da sala ${r.code}`} onChange={(v) => toggleRoomAvailable(r.id, v)} /></Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
