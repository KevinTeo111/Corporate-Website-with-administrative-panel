import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { RoomTable } from "@/components/admin/room-table";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({ orderBy: [{ available: "desc" }, { floor: "desc" }] });
  return (
    <>
      <PageTitle title="Salas" description="Marque a disponibilidade. Quando nenhuma sala estiver disponível, o formulário 'Avise-me' ganha destaque no site." />
      <RoomTable rooms={rooms} />
    </>
  );
}
