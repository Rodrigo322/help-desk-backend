# Deploy Frontend - Vercel

## Objetivo

Publicar o frontend React + TypeScript + Vite em producao na Vercel com configuracao simples e previsivel.

## Arquivos de suporte

- `vercel.json`: fallback de rotas SPA para `index.html`
- `.env.example`: variavel publica de API (`VITE_API_URL`)

## Variavel de ambiente obrigatoria

- `VITE_API_URL`: URL base da API backend (incluindo `/v1`)
  - Exemplo: `https://seu-backend.onrender.com/v1`

## Configuracao esperada na Vercel

Se o repositorio contem backend e frontend no mesmo projeto:

- **Root Directory**: `frontend`

Configuracoes do projeto frontend:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci` (ou padrao da Vercel)
- **Node.js**: usar versao LTS (20+ recomendado)

## Como fazer deploy

1. Criar projeto na Vercel conectando o repositorio.
2. Ajustar `Root Directory` para `frontend` (quando aplicavel).
3. Configurar a env var `VITE_API_URL` no painel da Vercel.
4. Executar deploy.
5. Validar login, listagem de tickets e navegacao por rotas internas.

## Checklist final de deploy

- [ ] `VITE_API_URL` configurada no painel da Vercel
- [ ] Backend publicado e acessivel em HTTPS
- [ ] Build do frontend concluindo sem erro
- [ ] Rotas SPA funcionando em refresh direto (ex.: `/tickets/123`)
- [ ] Requisicoes autenticadas chegando ao backend
- [ ] Sem dependencias locais/path-based no `package.json`
