import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { leadWhere, type LeadSearch } from "@/lib/leads";
import { PageTitle } from "@/components/admin/ui";
import { LeadTable } from "@/components/admin/lead-table";
import { LeadFilters } from "@/components/admin/lead-filters";

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<LeadSearch> }) {
  const sp = await searchParams;
  const leads = await prisma.roomLead.findMany({ where: leadWhere(sp), orderBy: { createdAt: "desc" } });
  const qs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();
  return (
    <>
      <PageTitle title="Interessados em salas" description="Contato manual, sem aviso automático. Altere o status conforme avança." />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <LeadFilters />
        <a href={`/api/admin/interessados/export${qs ? `?${qs}` : ""}`} className="btn-ghost btn-sm self-start"><Download className="h-3.5 w-3.5" /> Exportar planilha {qs ? "(filtrada)" : "(completa)"}</a>
      </div>
      <LeadTable leads={leads} />
    </>
  );
}
