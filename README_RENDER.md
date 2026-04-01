# Uso do `render.yaml` (Backend)

Este projeto inclui o arquivo [`render.yaml`](./render.yaml) para criar o Web Service no Render com os comandos corretos de build e start para Express + Prisma + TypeScript.

## O que o blueprint faz

- Build:
  - `npm ci`
  - `npm run prisma:generate`
  - `npm run build`
- Start:
  - `npm run prisma:migrate:deploy`
  - `npm run start`

## Como usar no Render

1. No Render, escolha **New +** -> **Blueprint**.
2. Conecte o repositorio e importe o `render.yaml`.
3. Antes do primeiro deploy, configure no painel (Environment) as variaveis:
   - `DATABASE_URL` (Neon pooled)
   - `DIRECT_URL` (Neon direct)
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - opcionais: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
4. Execute o deploy.

## Observacoes

- Nenhum segredo foi embutido no `render.yaml`.
- O servico aplica migrations em producao com `prisma migrate deploy` no start.
- `NODE_ENV=production` ja vem definido no blueprint.
