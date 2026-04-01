# Prisma 7 - Ajuste de Configuracao

## Por que esse erro acontece

No Prisma 7, a configuracao de conexao nao deve mais ficar no `schema.prisma` (`datasource` com `url`, `directUrl`, `shadowDatabaseUrl`).

Quando o projeto ainda usa:

- `url = env("DATABASE_URL")`
- `directUrl = env("DIRECT_URL")`

o Prisma 7 pode acusar erro de configuracao invalida ao carregar schema/config.

## O que mudou no Prisma 7

- O `schema.prisma` deve manter o `datasource` apenas com `provider`.
- A configuracao de conexao passa para `prisma.config.ts`.
- Para PostgreSQL em runtime com Prisma Client, usar driver adapter (`@prisma/adapter-pg`) com `pg`.

## Como ficou neste projeto

- `prisma/schema.prisma`: datasource apenas com `provider = "postgresql"`.
- `prisma.config.ts`:
  - `DATABASE_URL` como conexao principal
  - `DIRECT_URL` para migrations
  - `SHADOW_DATABASE_URL` opcional para ambiente local
- `src/database/prisma.ts`:
  - `PrismaClient` inicializado com adapter PostgreSQL (`PrismaPg`).

## Variaveis de ambiente necessarias

Obrigatorias:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`

Opcional (desenvolvimento):

- `SHADOW_DATABASE_URL`

Arquivo de referencia: `.env.example`.

## Como rodar localmente (PostgreSQL)

1. Instalar dependencias:

```bash
npm install
```

2. Configurar `.env` a partir de `.env.example`.

3. Gerar Prisma Client:

```bash
npm run prisma:generate
```

4. Rodar migrations locais:

```bash
npm run prisma:migrate
```

5. Subir API:

```bash
npm run dev
```

## Migrations em producao

Use sempre:

```bash
npm run prisma:migrate:deploy
```

Esse comando aplica migrations pendentes sem fluxo interativo.
