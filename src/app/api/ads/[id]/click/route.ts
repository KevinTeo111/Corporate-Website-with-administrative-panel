import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await prisma.ad.findUnique({ where: { id }, select: { link: true } });
  if (!ad) return NextResponse.redirect(new URL("/", _req.url));
  await prisma.ad.update({ where: { id }, data: { clicks: { increment: 1 } } });
  return NextResponse.redirect(ad.link, { status: 302 });
}
