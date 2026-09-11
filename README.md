# Vitalis Hub · demo

Demonstração do site institucional com painel administrativo para um centro empresarial de saúde: diretório de empresas e profissionais, salas com captação de interessados, blog, FAQ e publicidade. Todos os dados são fictícios.

## Stack

- Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript
- Tailwind CSS 4
- Prisma 6 em modo driver adapter (node-postgres) sobre Postgres do Supabase; migrações versionadas em `prisma/migrations`
- SheetJS (`xlsx`) para importação por planilha, modelo e exportação de interessados

## Rodando

1. Crie um projeto no Supabase e copie as strings de conexão (pooler na porta 6543 e direta na 5432).
2. `cp .env.example .env` e preencha `DATABASE_URL`, `DIRECT_URL` e `AUTH_SECRET`.
3. `npm install`
4. `npm run db:migrate` aplica as migrações e cria as tabelas (`npm run db:push` também funciona para um banco descartável).
5. `npm run db:seed` carrega os dados de demonstração (29 empresas, 30 profissionais, salas, interessados, artigos, FAQ, banners, anúncios e dois usuários).
6. `npm run dev` e abra http://localhost:3000.

Painel: http://localhost:3000/admin · `admin@vitalishub.com.br` / `demo1234`.

Sem Supabase, qualquer Postgres serve: aponte as duas variáveis para a mesma URL.

## O que a demo cobre

| Requisito do cliente | Onde está |
|---|---|
| Home com banners administráveis, busca, categorias, destaques, artigos, publicidade e contato | `/` · banners em `/admin/banners` |
| Empresas com cartões, busca, filtros e popup com fotos, sala, andar, horários, WhatsApp e redes | `/empresas` |
| Profissionais com conselho/UF, várias especialidades e várias empresas, contato por local | `/profissionais` |
| Serviços por categoria (lojas, escritórios, estacionamento, lava-car, auditório) | `/servicos` |
| Salas com fotos, metragem, andar, "Consulte condições" e formulário "Avise-me" destacado quando não há oferta | `/salas` · `/admin/salas` |
| Interessados com data, status, filtros e exportação de planilha | `/admin/interessados` |
| Importação por planilha: modelo, prévia, validação, duplicidades, confirmação e relatório; só novos registros | `/admin/importacao` |
| Blog com rascunho, publicação e retirada; destaque da home oculto quando vazio | `/blog` · `/admin/blog` |
| FAQ com criar, editar, excluir, ordenar, ativar | `/faq` · `/admin/faq` |
| Publicidade em dois grupos, rodízio por carregamento, cliques, "Anuncie aqui" | faixas na home e diretórios · `/admin/publicidade` |
| Contas individuais, login, recuperação de senha, histórico de ações | `/admin/login` · `/admin/historico` |

## Estrutura

```
prisma/schema.prisma      modelo de dados
prisma/migrations         migração inicial (SQL)
prisma/seed.ts            dados fictícios
src/app/(site)            páginas públicas
src/app/admin             login e painel
src/app/api               cliques em anúncios, exportação e modelo de planilha
src/lib/data.ts           consultas do site público
src/lib/actions           server actions (público e painel)
src/lib/import.ts         leitura, validação e gravação da importação
src/lib/auth.ts           sessão assinada em cookie httpOnly, hash scrypt
src/components/site       componentes do site
src/components/admin      componentes do painel
```

## Simplificações desta demo

- Upload de imagens: os campos aceitam URL. No projeto final, o upload vai para o Supabase Storage com otimização automática.
- E-mails (notificação de interessados, pedidos de anúncio e recuperação de senha) são registrados no console. No projeto final, SMTP do domínio do cliente.
- As fotos vêm de um serviço de imagens de exemplo (picsum.photos).
