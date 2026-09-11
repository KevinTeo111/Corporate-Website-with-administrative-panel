import { prisma } from "@/lib/prisma";
import { PageTitle, Table, Th, Td } from "@/components/admin/ui";
import { ImportWizard } from "@/components/admin/import-wizard";
import { formatDateTime } from "@/lib/utils";

export default async function ImportPage() {
  const batches = await prisma.importBatch.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  return (
    <>
      <PageTitle title="Importação por planilha" description="Baixe o modelo, preencha, envie e confira a prévia antes de confirmar. Só registros novos são inseridos; os existentes nunca são sobrescritos." />
      <ImportWizard />
      <h2 className="mb-3 mt-10 font-sans text-base font-bold text-ink-900">Importações anteriores</h2>
      <Table>
        <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Data</Th><Th>Arquivo</Th><Th>Tipo</Th><Th>Linhas</Th><Th>Inseridos</Th><Th>Ignorados</Th><Th>Por</Th></tr></thead>
        <tbody className="divide-y divide-sand-200">
          {batches.map((b) => (
            <tr key={b.id}>
              <Td className="whitespace-nowrap text-xs text-ink-500">{formatDateTime(b.createdAt)}</Td>
              <Td className="font-medium text-ink-900">{b.filename}</Td>
              <Td className="capitalize text-ink-700">{b.kind}</Td>
              <Td>{b.total}</Td><Td className="text-pine-700">{b.inserted}</Td><Td className="text-coral-600">{b.skipped}</Td>
              <Td className="text-xs text-ink-500">{b.userName}</Td>
            </tr>
          ))}
          {batches.length === 0 && <tr><Td className="py-8 text-center text-ink-500">Nenhuma importação ainda.</Td></tr>}
        </tbody>
      </Table>
    </>
  );
}
