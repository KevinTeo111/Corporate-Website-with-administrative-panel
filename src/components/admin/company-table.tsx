"use client";

import Link from "next/link";
import type { Company, Category } from "@prisma/client";
import { Table, Th, Td, Toggle, Badge } from "./ui";
import { Avatar } from "@/components/site/avatar";
import { toggleCompanyField } from "@/lib/actions/admin";
import { floorLabel } from "@/lib/utils";

type Row = Company & { category: Category; _count: { professionals: number } };

export function CompanyTable({ companies }: { companies: Row[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50">
        <tr><Th>Empresa</Th><Th>Categoria</Th><Th>Local</Th><Th>Profissionais</Th><Th>Destaque</Th><Th>Ativa</Th><Th /></tr>
      </thead>
      <tbody className="divide-y divide-sand-200">
        {companies.map((c) => (
          <tr key={c.id} className={c.active ? "" : "opacity-60"}>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={c.name} src={c.logoUrl} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-500">{c.externalId}</p>
                </div>
              </div>
            </Td>
            <Td><Badge>{c.category.name}</Badge></Td>
            <Td className="whitespace-nowrap text-ink-700">Sala {c.room} · {floorLabel(c.floor)}</Td>
            <Td className="text-ink-700">{c._count.professionals}</Td>
            <Td><Toggle checked={c.featured} label={`Destacar ${c.name}`} onChange={(v) => toggleCompanyField(c.id, "featured", v)} /></Td>
            <Td><Toggle checked={c.active} label={`Ativar ${c.name}`} onChange={(v) => toggleCompanyField(c.id, "active", v)} /></Td>
            <Td className="text-right"><Link href={`/admin/empresas/${c.id}`} className="btn-ghost btn-sm">Editar</Link></Td>
          </tr>
        ))}
        {companies.length === 0 && <tr><Td className="py-10 text-center text-ink-500">Nenhuma empresa encontrada.</Td></tr>}
      </tbody>
    </Table>
  );
}
