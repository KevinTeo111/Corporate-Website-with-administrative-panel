"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function AdminSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q.trim()) next.set("q", q.trim()); else next.delete("q");
      if (next.toString() !== params.toString()) router.replace(`${pathname}?${next.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <label className="relative mb-4 block max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="input pl-10" aria-label={placeholder} />
    </label>
  );
}
