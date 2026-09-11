import "server-only";
import { cookies } from "next/headers";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "./prisma";

const COOKIE = "vh_admin";
const TTL_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.AUTH_SECRET ?? "dev-only-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export async function createSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${userId}.${exp}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const [userId, exp, sig] = token.split(".");
  if (!userId || !exp || !sig) return null;
  if (sign(`${userId}.${exp}`) !== sig) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  return prisma.adminUser.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } });
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function logAction(
  user: { id: string; name: string },
  action: string,
  entity: string,
  detail?: string,
  entityId?: string,
) {
  await prisma.activityLog.create({
    data: { userId: user.id, userName: user.name, action, entity, entityId, detail },
  });
}
