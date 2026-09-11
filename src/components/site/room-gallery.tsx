"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function RoomGallery({ photos, title }: { photos: string[]; title: string }) {
  const [i, setI] = useState(0);
  if (photos.length === 0) return <div className="aspect-[4/3] bg-sand-200" />;
  return (
    <div className="relative bg-sand-200">
      <img key={i} src={photos[i]} alt={`${title}, foto ${i + 1}`} className="aspect-[4/3] w-full object-cover animate-fade-up lg:h-full" />
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-2">
          {photos.map((p, idx) => (
            <button key={p} type="button" onClick={() => setI(idx)} aria-label={`Foto ${idx + 1}`} className={cn("h-12 w-16 overflow-hidden rounded-lg ring-2 transition", idx === i ? "ring-white" : "ring-transparent opacity-70 hover:opacity-100")}>
              <img src={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
