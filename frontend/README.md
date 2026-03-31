# Frontend - Sistema de Chamados

## Visao Geral da Arquitetura

Este projeto implementa o frontend do sistema de chamados com separacao por camadas e responsabilidades:

- `pages`: composicao de tela e fluxo de navegacao.
- `components`: UI reutilizavel, formularios e layout.
- `hooks`: regra de integracao com API e cache (TanStack Query).
- `contexts`: estado global de autenticacao.
- `schemas`: validacao de entrada com Zod.
- `services`: cliente HTTP Axios e servicos de acesso.
- `types`: contratos tipados de dominio e API.
- `utils`: utilitarios puros (storage, formatadores, regras auxiliares).

A regra de negocio de UI nao fica concentrada nas paginas. As paginas orquestram hooks e componentes.

## Stack Usada

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS

## Estrutura de Pastas

```txt
src/
  main.tsx
  App.tsx

  routes/
    index.tsx
    protected-route.tsx

  pages/
    auth/
      sign-in.tsx
    dashboard/
      index.tsx
    tickets/
      list-tickets.tsx
      create-ticket.tsx
      ticket-details.tsx

  components/
    ui/
      badge.tsx
      button.tsx
      card.tsx
      empty-state.tsx
      error-state.tsx
      form-field.tsx
      input.tsx
      loading.tsx
      priority-badge.tsx
      select.tsx
      status-badge.tsx
      textarea.tsx
    forms/
      create-comment-form.tsx
      create-ticket-form.tsx
      sign-in-form.tsx
      update-ticket-status-form.tsx
      upload-attachment-form.tsx
    layout/
      app-layout.tsx
      header.tsx
      sidebar.tsx

  contexts/
    auth-context.tsx

  hooks/
    use-auth.ts
    use-dashboard.ts
    use-sign-in.ts
    use-ticket-attachments.ts
    use-ticket-comments.ts
    use-ticket-details.ts
    use-ticket-listing.ts
    use-tickets.ts

  schemas/
    auth/
      sign-in-schema.ts
    tickets/
      comment-schema.ts
      create-ticket-schema.ts
      filters-schema.ts
      update-ticket-status-schema.ts

  services/
    api.ts
    auth-service.ts

  types/
    api.ts
    attachment.ts
    auth.ts
    comment.ts
    ticket.ts

  utils/
    format-date.ts
    format-priority.ts
    format-status.ts
    storage.ts
    ticket-status-transition.ts
```

## Como Rodar o Projeto

### Pre-requisitos

- Node.js 18+
- npm 9+
- Backend do sistema de chamados rodando e acessivel

### Passos

1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis de ambiente:

```bash
# Linux/macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

3. Suba o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Build de producao:

```bash
npm run build
```

5. Preview local do build:

```bash
npm run preview
```

## Variaveis de Ambiente

Arquivo `.env`:

```env
VITE_API_BASE_URL="http://localhost:3333/v1"
```

Observacoes:

- O backend deve expor rotas versionadas com prefixo `/v1`.
- O valor de `VITE_API_BASE_URL` deve apontar para a base da API.

## Como a Autenticacao Funciona

Fluxo implementado:

1. Usuario envia email e senha em `SignInForm`.
2. `useSignIn` chama `auth-service.ts`, que usa `api.ts` para `POST /sessions`.
3. Em sucesso, `AuthProvider` persiste `token` e `user` no `localStorage`.
4. Interceptor de request do Axios injeta automaticamente `Authorization: Bearer <token>`.
5. `ProtectedRoute` bloqueia acesso a rotas privadas quando nao autenticado.
6. Interceptor de response trata `401` centralmente:
   - dispara `unauthorizedHandler` registrado no `AuthProvider`;
   - limpa sessao e storage;
   - o usuario volta para fluxo de login por protecao de rota.

## Principais Rotas

### Rotas de frontend

- `GET /sign-in` -> pagina publica de login
- `GET /` -> dashboard autenticada
- `GET /tickets` -> listagem de tickets
- `GET /tickets/new` -> criacao de ticket
- `GET /tickets/:id` -> detalhe do ticket

### Endpoints backend consumidos

- `POST /v1/sessions`
- `GET /v1/tickets`
- `POST /v1/tickets`
- `GET /v1/tickets/:id`
- `PATCH /v1/tickets/:id/status`
- `GET /v1/tickets/:ticketId/comments`
- `POST /v1/tickets/:ticketId/comments`
- `GET /v1/tickets/:ticketId/attachments`
- `POST /v1/tickets/:ticketId/attachments`

## Padrao de Consumo da API

Padrao adotado no frontend:

- Cliente Axios unico em `src/services/api.ts`.
- Request interceptor para token Bearer.
- Response interceptor para tratamento global de `401`.
- Contrato de resposta:
  - sucesso: `{ success: true, data: ... }`
  - erro: `{ success: false, error: { message: string } }`
- `unwrapApiResponse` converte resposta tipada e lanca erro quando `success` for `false`.
- `getApiErrorMessage` centraliza mensagem amigavel para exibicao.
- Hooks com TanStack Query concentram:
  - fetch e mutacoes;
  - invalidacao de cache;
  - normalizacao de filtros/payloads.

## Convencoes Arquiteturais Obrigatorias

- Nao fazer chamadas HTTP diretamente nas paginas.
- Centralizar integracao HTTP em `services` + `hooks`.
- Formularios com React Hook Form + Zod.
- Validacao com Zod antes de enviar payload para API.
- Componentes de pagina devem ser finos e focados em composicao.
- Reuso de componentes de UI em `components/ui`.
- Estado de autenticacao centralizado em `AuthContext`.
- Rotas privadas protegidas por `ProtectedRoute`.
- Tipagem forte para payloads, responses e entidades de dominio.
- Seguir versionamento de API com prefixo `/v1`.
