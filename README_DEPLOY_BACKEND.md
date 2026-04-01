# Deploy Backend - Render + Neon

## Objetivo

Guia objetivo para publicar este backend Node.js + TypeScript + Express + Prisma em producao usando:

- Render (Web Service)
- Neon (PostgreSQL)

## Pre-requisitos no codigo

Este projeto ja esta preparado para deploy com:

- `PORT` por ambiente (`process.env.PORT`) e bind em `0.0.0.0`
- suporte a `NODE_ENV=production`
- CORS via `CORS_ORIGIN`
- Prisma com `DATABASE_URL` (runtime pooled) e `DIRECT_URL` (migrate/CLI)
- script de migracao de producao: `npm run prisma:migrate:deploy`

## Variaveis de ambiente necessarias

Configure no Render:

- `NODE_ENV=production`
- `DATABASE_URL=<neon pooled connection string>`
- `DIRECT_URL=<neon direct connection string>`
- `JWT_SECRET=<secret forte>`
- `CORS_ORIGIN=<origem do frontend>`

Opcional:

- `PORT` (Render normalmente injeta automaticamente)
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Ordem correta de configuracao com Neon

1. Crie o projeto no Neon.
2. Copie duas connection strings:
   - pooled (pooler) para `DATABASE_URL`
   - direct (sem pooler) para `DIRECT_URL`
3. No Render, crie o Web Service apontando para este repositorio.
4. Antes do primeiro deploy, configure todas as variaveis de ambiente.
5. Execute o deploy.
6. As migrations serao aplicadas com `prisma migrate deploy` no start.

## Configuracao no Render

### Runtime

- Environment: `Node`
- Region: escolha a mais proxima do Neon/front
- Root directory: raiz do backend (neste repositorio, `.`)

### Build Command

```bash
npm ci && npm run prisma:generate && npm run build
```

### Start Command

```bash
npm run prisma:migrate:deploy && npm run start
```

## Prisma em producao

Padrao adotado:

- `DATABASE_URL` -> conexao pooled para runtime da API
- `DIRECT_URL` -> conexao direta para `prisma migrate deploy`

Comandos relevantes:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

## Verificacao rapida pos-deploy

1. Verifique logs de boot no Render:
   - ambiente, host e porta
2. Verifique se `prisma migrate deploy` foi executado sem erro.
3. Teste endpoint de health basico (ou rota autenticacao/listagem).
4. Valide CORS a partir do frontend publicado.

## Troubleshooting

- Erro de conexao em runtime:
  - revise `DATABASE_URL` pooled
- Erro em migrate deploy:
  - revise `DIRECT_URL` (deve ser conexao direta)
- 401 inesperado:
  - valide `JWT_SECRET` em producao
- CORS bloqueando frontend:
  - ajuste `CORS_ORIGIN` para dominio exato do frontend
