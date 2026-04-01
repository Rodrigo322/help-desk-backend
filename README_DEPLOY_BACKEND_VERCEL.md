# Deploy Backend na Vercel (Express + Prisma)

## Resumo

Este backend pode ser publicado na Vercel usando uma Function Node (`api/index.ts`) que reutiliza o `app` Express.

## Arquivos de deploy

- `api/index.ts`: entrada serverless da Vercel
- `vercel.json`: rewrite de rotas para o Express

## Variaveis obrigatorias na Vercel

Configure em **Project Settings > Environment Variables**:

- `NODE_ENV=production`
- `DATABASE_URL=<Neon pooled URL>`
- `DIRECT_URL=<Neon direct URL>`
- `JWT_SECRET=<secret forte>`
- `CORS_ORIGIN=<URL do frontend>`

Opcional:

- `MASTER_NAME`
- `MASTER_EMAIL`
- `MASTER_PASSWORD`
- `MASTER_ROLE`
- `MASTER_DEPARTMENT`

## Build e Runtime

- Install command: `npm install`
- Build command: `npm run build`
- O `prisma generate` roda no `postinstall`.

## Migrations em producao (importante)

Na Vercel nao existe `preDeployCommand` como na Render. Rode migrations manualmente no seu ambiente local/CI usando o banco de producao:

```bash
npm run prisma:migrate:deploy
```

Use `DIRECT_URL` de producao durante esse comando.

## Teste rapido apos deploy

1. Abra: `https://SEU_DOMINIO.vercel.app/v1/health`
2. Teste login: `POST /v1/sessions`
3. Valide CORS com o frontend publicado

## Limitacao de anexos na Vercel

A Vercel usa filesystem efemero em runtime. Neste projeto, uploads locais usam `/tmp/uploads` em ambiente Vercel.

Isso significa:

- os arquivos podem nao persistir entre invocacoes
- nao e recomendado para anexos de producao

Para producao real, mova anexos para storage externo (ex.: Vercel Blob, S3, Cloudinary).
