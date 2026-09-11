"use client";

import Link from "next/link";
import type { Professional, Specialty } from "@prisma/client";
import { Table, Th, Td, Toggle } from "./ui";
import { Avatar } from "@/components/site/avatar";
import { toggleProfessionalActive } from "@/lib/actions/admin";

type Row = Professional & { specialties: Specialty[]; companies: { company: { name: string } }[] };

export function ProfessionalTable({ professionals }: { professionals: Row[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50">
        <tr><Th>Profissional</Th><Th>Registro</Th><Th>Especialidades</Th><Th>Atende em</Th><Th>Ativo</Th><Th /></tr>
      </thead>
      <tbody className="divide-y divide-sand-200">
        {professionals.map((p) => (
          <tr key={p.id} className={p.active ? "" : "opacity-60"}>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={p.name} src={p.photoUrl} size="sm" rounded="rounded-full" />
                <div className="min-w-0"><p className="truncate font-semibold text-ink-900">{p.name}</p><p className="text-xs text-ink-500">{p.externalId}</p></div>
              </div>
            </Td>
            <Td className="whitespace-nowrap text-ink-700">{p.council} {p.registration}/{p.uf}</Td>
            <Td><div className="flex flex-wrap gap-1">{p.specialties.map((s) => <span key={s.id} className="rounded-full bg-pine-50 px-2 py-0.5 text-[11px] font-semibold text-pine-700">{s.name}</span>)}</div></Td>
            <Td className="max-w-56 text-xs text-ink-700">{p.companies.map((c) => c.company.name).join(", ") || <span className="text-coral-600">sem vínculo</span>}</Td>
            <Td><Toggle checked={p.active} label={`Ativar ${p.name}`} onChange={(v) => toggleProfessionalActive(p.id, v)} /></Td>
            <Td className="text-right"><Link href={`/admin/profissionais/${p.id}`} className="btn-ghost btn-sm">Editar</Link></Td>
          </tr>
        ))}
        {professionals.length === 0 && <tr><Td className="py-10 text-center text-ink-500">Nenhum profissional encontrado.</Td></tr>}
      </tbody>
    </Table>
  );
}
