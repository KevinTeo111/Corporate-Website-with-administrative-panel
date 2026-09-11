import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
