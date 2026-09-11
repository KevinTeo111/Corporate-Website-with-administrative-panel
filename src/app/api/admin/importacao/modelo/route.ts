import { getSessionUser } from "@/lib/auth";
import { buildTemplate, type ImportKind } from "@/lib/import";

export async function GET(req: Request) {
  if (!(await getSessionUser())) return new Response("Unauthorized", { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind") as ImportKind;
  if (kind !== "empresas" && kind !== "profissionais") return new Response("Bad request", { status: 400 });
  const buf = buildTemplate(kind);
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="modelo-${kind}.xlsx"`,
    },
  });
}
