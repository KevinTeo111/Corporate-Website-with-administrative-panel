import { prisma } from "@/lib/prisma";
import { PageTitle, Table, Th, Td, Badge } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

const tones: Record<string, "good" | "warn" | "bad" | "info" | "neutral"> = { CREATE: "good", IMPORT: "good", PUBLISH: "good", UPDATE: "info", DELETE: "bad", LOGIN: "neutral", LOGOUT: "neutral", EXPORT: "warn" };

export default async function HistoryPage() {
  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <PageTitle title="Histórico de acessos e ações" description="Registro básico com usuário e data. Sem restauração de versões." />
      <Table>
        <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Data</Th><Th>Usuário</Th><Th>Ação</Th><Th>Entidade</Th><Th>Detalhe</Th></tr></thead>
        <tbody className="divide-y divide-sand-200">
          {logs.map((l) => (
            <tr key={l.id}>
              <Td className="whitespace-nowrap text-xs text-ink-500">{formatDateTime(l.createdAt)}</Td>
              <Td className="font-medium text-ink-900">{l.userName}</Td>
              <Td><Badge tone={tones[l.action] ?? "neutral"}>{l.action}</Badge></Td>
              <Td className="text-ink-700">{l.entity}</Td>
              <Td className="text-ink-700">{l.detail ?? "—"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
