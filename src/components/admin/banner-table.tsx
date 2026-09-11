"use client";

import type { Banner } from "@prisma/client";
import { Table, Th, Td, Toggle } from "./ui";
import { toggleBannerActive } from "@/lib/actions/admin";

export function BannerTable({ banners }: { banners: Banner[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Ordem</Th><Th>Banner</Th><Th>Link</Th><Th>Ativo</Th></tr></thead>
      <tbody className="divide-y divide-sand-200">
        {banners.map((b) => (
          <tr key={b.id}>
            <Td className="text-ink-500">{b.order}</Td>
            <Td>
              <div className="flex items-center gap-3">
                <img src={b.imageUrl} alt="" className="h-12 w-20 rounded-lg object-cover" />
                <div><p className="font-semibold text-ink-900">{b.title}</p><p className="text-xs text-ink-500">{b.subtitle}</p></div>
              </div>
            </Td>
            <Td className="font-mono text-xs text-ink-700">{b.link ?? "—"}</Td>
            <Td><Toggle checked={b.active} label={`Ativar banner ${b.title}`} onChange={(v) => toggleBannerActive(b.id, v)} /></Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
