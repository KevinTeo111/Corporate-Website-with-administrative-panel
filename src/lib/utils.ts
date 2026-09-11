export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function initials(name: string) {
  const clean = name.replace(/^(Dr\.|Dra\.)\s+/i, "");
  const parts = clean.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

export function floorLabel(floor: number) {
  if (floor === 0) return "Térreo";
  if (floor < 0) return `${Math.abs(floor)}º subsolo`;
  return `${floor}º andar`;
}

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${digits}`);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function formatDate(date: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", opts).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export const roomModeLabel: Record<string, string> = { RENT: "Locação", SALE: "Venda", BOTH: "Locação ou venda" };
export const leadStatusLabel: Record<string, string> = { NEW: "Novo", CONTACTED: "Contatado", CLOSED: "Encerrado" };
export const articleStatusLabel: Record<string, string> = { DRAFT: "Rascunho", PUBLISHED: "Publicado", ARCHIVED: "Retirado" };

// A stable hue per string, used for initials avatars so every company gets a
// consistent colour without storing one.
export function hueFor(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) % 360;
  return h;
}
