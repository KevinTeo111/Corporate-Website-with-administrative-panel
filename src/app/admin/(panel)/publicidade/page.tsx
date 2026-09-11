import { prisma } from "@/lib/prisma";
import { PageTitle, Table, Th, Td } from "@/components/admin/ui";
import { AdTable } from "@/components/admin/ad-table";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAdsPage() {
  const [ads, inquiries] = await Promise.all([
    prisma.ad.findMany({ orderBy: [{ group: "asc" }, { position: "asc" }, { advertiser: "asc" }] }),
    prisma.adInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return (
    <>
      <PageTitle title="Publicidade" description="Um anúncio por faixa a cada carregamento, alternando entre os ativos do grupo. Contagem simples de cliques, sem visitantes únicos." />
      <AdTable ads={ads} />
      <h2 className="mb-3 mt-10 font-sans text-base font-bold text-ink-900">Pedidos "Anuncie aqui"</h2>
      <Table>
        <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Data</Th><Th>Empresa</Th><Th>Contato</Th><Th>Mensagem</Th></tr></thead>
        <tbody className="divide-y divide-sand-200">
          {inquiries.map((i) => (
            <tr key={i.id}>
              <Td className="whitespace-nowrap text-xs text-ink-500">{formatDateTime(i.createdAt)}</Td>
              <Td><p className="font-semibold text-ink-900">{i.company}</p><p className="text-xs text-ink-500">{i.name}</p></Td>
              <Td className="text-xs"><a href={`mailto:${i.email}`} className="block text-pine-700 hover:underline">{i.email}</a><span className="text-ink-700">{i.whatsapp}</span></Td>
              <Td className="max-w-md text-xs text-ink-700">{i.message}</Td>
            </tr>
          ))}
          {inquiries.length === 0 && <tr><Td className="py-8 text-center text-ink-500">Nenhum pedido recebido.</Td></tr>}
        </tbody>
      </Table>
    </>
  );
}
