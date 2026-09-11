import { cn, hueFor, initials } from "@/lib/utils";

export function Avatar({ name, src, size = "md", className, rounded = "rounded-2xl" }: { name: string; src?: string | null; size?: "sm" | "md" | "lg" | "xl"; className?: string; rounded?: string }) {
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-lg", xl: "h-24 w-24 text-2xl" };
  const hue = hueFor(name);
  if (src) {
    return <img src={src} alt="" className={cn("object-cover", sizes[size], rounded, className)} />;
  }
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center font-display font-semibold", sizes[size], rounded, className)}
      style={{ background: `oklch(0.93 0.05 ${hue})`, color: `oklch(0.38 0.09 ${hue})` }}
    >
      {initials(name).toUpperCase()}
    </span>
  );
}
