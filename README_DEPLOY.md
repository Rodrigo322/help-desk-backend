# Deploy Completo (Gratis) - Sistema de Chamados

Arquitetura alvo:

- Frontend: Vercel
- Backend: Render (Web Service)
- Banco: Neon (PostgreSQL)

Este guia esta pronto para uso real com o codigo atual do projeto.

## 1) Ordem correta do deploy

1. Criar banco no Neon.
2. Copiar connection strings `pooled` e `direct`.
3. Configurar e publicar o backend no Render.
4. Validar backend (incluindo migrations).
5. Publicar frontend na Vercel.
6. Configurar `VITE_API_URL` no frontend.
7. Ajustar `CORS_ORIGIN` no backend para a URL final do frontend.
8. Rodar checklist final de testes.

## 2) Criacao do banco na Neon

1. Criar conta/projeto na Neon.
2. Criar database (ex.: `app_db`) no branch principal.
3. Na tela de conexao, localizar:
   - URL pooled (pooler)
   - URL direct (conexao direta)

## 3) Connection string pooled e direct

No projeto atual, o padrao e:

- `DATABASE_URL`: usar a URL pooled (runtime da API)
- `DIRECT_URL`: usar a URL direct (Prisma Migrate/CLI)

Exemplo de referencia:

```env
DATABASE_URL=postgresql://USER:PASSWORD@POOLED_HOST/DB?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://USER:PASSWORD@DIRECT_HOST/DB?sslmode=require
```

## 4) Variaveis de ambiente do backend (Render)

Obrigatorias:

- `NODE_ENV=production`
- `DATABASE_URL=<pooled da Neon>`
- `DIRECT_URL=<direct da Neon>`
- `JWT_SECRET=<secret forte>`
- `CORS_ORIGIN=<url do frontend na Vercel>`

Opcionais:

- `PORT` (Render injeta automaticamente)
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## 5) Deploy do backend no Render

Voce pode usar:

- Blueprint com `render.yaml` (recomendado), ou
- Criacao manual de Web Service

### 5.1 Build e Start esperados

- Build Command:

```bash
npm ci && npm run prisma:generate && npm run build
```

- Start Command:

```bash
npm run prisma:migrate:deploy && npm run start
```

### 5.2 Confirmacoes importantes no Render

- Runtime: Node
- Root Directory: raiz do backend (neste repositorio: `.`)
- Auto Deploy: habilitado (opcional, recomendado)

## 6) Migrations Prisma em producao

Este projeto esta preparado para `migrate deploy`.

Comando usado em producao:

```bash
npm run prisma:migrate:deploy
```

No fluxo atual, este comando ja roda no `start` do Render antes de subir a API.

Validacao:

- Verificar logs do Render:
  - migrations aplicadas com sucesso
  - servidor iniciado sem erro

## 7) Deploy do frontend na Vercel

### 7.1 Configuracao recomendada

- Framework Preset: `Vite`
- Root Directory: `frontend` (se repo monorepo)
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

### 7.2 Roteamento SPA

O projeto ja inclui `frontend/vercel.json` com rewrite para `index.html`, evitando erro 404 em refresh de rotas como `/tickets/123`.

## 8) Configurar `VITE_API_URL` no frontend

Na Vercel, adicionar:

- `VITE_API_URL=https://SEU_BACKEND.onrender.com/v1`

Depois disso:

1. Fazer redeploy do frontend.
2. Testar login e chamadas autenticadas.

## 9) Configurar `CORS_ORIGIN` no backend

No Render, definir:

- `CORS_ORIGIN=https://SEU_FRONTEND.vercel.app`

Se usar dominio customizado no frontend, atualizar para esse dominio e redeployar o backend.

Observacao pratica:

- Durante setup inicial, voce pode usar um valor temporario para destravar deploy.
- Ao final, sempre restrinja para o dominio real do frontend.

## 10) Checklist final de testes

- [ ] Backend responde em producao (`/v1/...`)
- [ ] Logs do Render sem erro de Prisma/migration
- [ ] Login funcionando no frontend
- [ ] Listagem de tickets funcionando
- [ ] Criacao de ticket funcionando
- [ ] Detalhe, comentarios e anexos funcionando
- [ ] Update de status funcionando com regras de transicao
- [ ] Refresh em rota interna da SPA nao retorna 404
- [ ] CORS sem bloqueios no navegador
- [ ] 401 invalido expira sessao no frontend corretamente

## 11) Erros comuns e correcao

### Erro: `P1001` / nao conecta no banco

Causa comum:

- `DATABASE_URL` ou `DIRECT_URL` incorreta

Correcao:

- Revalidar URLs da Neon
- Confirmar `sslmode=require`
- Confirmar pooled em `DATABASE_URL` e direct em `DIRECT_URL`

### Erro: migration falha no startup

Causa comum:

- `DIRECT_URL` faltando ou apontando para pooler

Correcao:

- Ajustar `DIRECT_URL` para conexao direta da Neon
- Fazer novo deploy

### Erro: frontend 401 em todas as chamadas

Causa comum:

- `JWT_SECRET` mudou apos tokens antigos

Correcao:

- Fazer login novamente
- Confirmar `JWT_SECRET` configurado no Render

### Erro: CORS blocked by browser

Causa comum:

- `CORS_ORIGIN` nao bate com dominio da Vercel

Correcao:

- Definir valor exato do frontend publicado
- Redeploy backend

### Erro: 404 ao atualizar pagina em rota interna

Causa comum:

- fallback de SPA ausente

Correcao:

- Garantir `frontend/vercel.json` com rewrite para `index.html`

### Erro: frontend chama localhost em producao

Causa comum:

- `VITE_API_URL` nao definida na Vercel

Correcao:

- Configurar env var e redeployar frontend

## 12) Limitacoes do plano gratuito

Como regra geral (pode variar por provedor e periodo):

- Render (free):
  - pode hibernar por inatividade (cold start no primeiro acesso)
  - recursos de CPU/RAM limitados
- Vercel (free):
  - limites de build e execucao por conta/projeto
  - limites de banda e funcoes conforme plano vigente
- Neon (free):
  - limites de armazenamento/compute e possivel throttling
  - politicas de branch/retencao variam por plano

Boas praticas:

- Monitorar logs e erros de timeout
- Reduzir custo de queries e payloads
- Evitar jobs pesados no startup
- Planejar upgrade de plano quando houver crescimento de trafego
