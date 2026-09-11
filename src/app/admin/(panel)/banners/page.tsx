import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { BannerTable } from "@/components/admin/banner-table";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageTitle title="Banners da home" description="Carrossel do topo da página inicial. Só os ativos aparecem, na ordem definida." />
      <BannerTable banners={banners} />
    </>
  );
}
