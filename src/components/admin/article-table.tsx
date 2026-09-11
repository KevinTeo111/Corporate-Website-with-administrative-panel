"use client";

import Link from "next/link";
import type { Article } from "@prisma/client";
import { Table, Th, Td, Badge, ActionButton } from "./ui";
import { setArticleStatus } from "@/lib/actions/admin";
import { articleStatusLabel, formatDate } from "@/lib/utils";

export function ArticleTable({ articles }: { articles: Article[] }) {
  return (
    <Table>
      <thead className="border-b border-sand-200 bg-sand-50"><tr><Th>Artigo</Th><Th>Categoria</Th><Th>Autoria</Th><Th>Publicado em</Th><Th>Status</Th><Th /></tr></thead>
      <tbody className="divide-y divide-sand-200">
        {articles.map((a) => (
          <tr key={a.id}>
            <Td>
              <div className="flex items-center gap-3">
                {a.coverUrl && <img src={a.coverUrl} alt="" className="h-10 w-16 rounded-lg object-cover" />}
                <p className="max-w-sm font-semibold text-ink-900">{a.title}</p>
              </div>
            </Td>
            <Td><Badge>{a.category}</Badge></Td>
            <Td className="text-ink-700">{a.author}</Td>
            <Td className="whitespace-nowrap text-xs text-ink-500">{a.publishedAt ? formatDate(a.publishedAt) : "—"}</Td>
            <Td><Badge tone={a.status === "PUBLISHED" ? "good" : a.status === "DRAFT" ? "warn" : "neutral"}>{articleStatusLabel[a.status]}</Badge></Td>
            <Td>
              <div className="flex justify-end gap-1.5">
                {a.status !== "PUBLISHED" && <ActionButton tone="primary" onClick={() => setArticleStatus(a.id, "PUBLISHED")}>Publicar</ActionButton>}
                {a.status === "PUBLISHED" && <ActionButton onClick={() => setArticleStatus(a.id, "ARCHIVED")}>Retirar</ActionButton>}
                {a.status === "ARCHIVED" && <ActionButton onClick={() => setArticleStatus(a.id, "DRAFT")}>Rascunho</ActionButton>}
                <Link href={`/admin/blog/${a.id}`} className="btn-ghost btn-sm">Editar</Link>
              </div>
            </Td>
          </tr>
        ))}
        {articles.length === 0 && <tr><Td className="py-10 text-center text-ink-500">Nenhum artigo. O destaque na home fica oculto enquanto não houver artigos publicados.</Td></tr>}
      </tbody>
    </Table>
  );
}
