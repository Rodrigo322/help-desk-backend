# Frontend - Sistema de Chamados

## Visao geral da arquitetura
Frontend React + TypeScript estruturado por camadas, seguindo separacao de responsabilidades:

- `pages`: composicao de telas e fluxo de navegacao
- `components`: UI reutilizavel, formularios e layout
- `hooks`: integracao com API e cache (TanStack Query)
- `contexts`: estado global de autenticacao
- `services`: cliente Axios centralizado
- `schemas`: validacao de entrada com Zod
- `types`: contratos de dominio e API
- `utils`: funcoes puras de apoio

## Stack
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS

## Estrutura de pastas
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
    notifications/
      index.tsx
    tickets/
      list-tickets.tsx
      create-ticket.tsx
      ticket-details.tsx

  components/
    ui/
    forms/
      sign-in-form.tsx
      create-ticket-form.tsx
      create-comment-form.tsx
      upload-attachment-form.tsx
    layout/
      app-layout.tsx
      sidebar.tsx
      header.tsx

  hooks/
    use-auth.ts
    use-sign-in.ts
    use-dashboard.ts
    use-departments.ts
    use-notifications.ts
    use-ticket-listing.ts
    use-tickets.ts
    use-ticket-details.ts
    use-ticket-comments.ts
    use-ticket-attachments.ts

  contexts/
    auth-context.tsx

  schemas/
    auth/
      sign-in-schema.ts
    tickets/
      create-ticket-schema.ts
      filters-schema.ts
      comment-schema.ts

  services/
    api.ts
    auth-service.ts

  types/
    api.ts
    auth.ts
    department.ts
    notification.ts
    ticket.ts
    comment.ts
    attachment.ts

  utils/
    storage.ts
    format-date.ts
    format-status.ts
    format-priority.ts
    env.ts
```

## Fluxo entre departamentos (frontend)
1. Usuario cria ticket para um `targetDepartmentId`.
2. Tela de detalhes mostra:
- departamento de origem
- departamento de destino
- usuario responsavel (quando houver)
3. Listagem possui escopos separados:
- chamados do meu departamento
- chamados que eu criei
- chamados atribuidos a mim
4. No detalhe do ticket:
- botao `Pegar chamado` quando permitido
- botao `Concluir chamado` quando permitido
5. Gestores possuem area de notificacoes (`/notifications`).

## Como rodar
1. Instalar dependencias:
```bash
npm install
```

2. Configurar ambiente:
```bash
cp .env.example .env
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

4. Build de producao:
```bash
npm run build
```

5. Preview local:
```bash
npm run preview
```

## Variaveis de ambiente
Arquivo `.env`:
```env
VITE_API_URL="http://localhost:3333/v1"
```

## Autenticacao
- Login em `POST /sessions`
- Token JWT salvo em `localStorage`
- Interceptor Axios injeta `Authorization: Bearer <token>`
- Tratamento centralizado de `401` limpa sessao
- `ProtectedRoute` bloqueia rotas privadas

## Principais rotas frontend
- `/sign-in`
- `/`
- `/tickets`
- `/tickets/new`
- `/tickets/:id`
- `/notifications`

## Endpoints backend consumidos
- `POST /v1/sessions`
- `GET /v1/departments`
- `GET /v1/notifications/me`
- `POST /v1/tickets`
- `GET /v1/tickets`
- `GET /v1/tickets/me/created`
- `GET /v1/tickets/me/assigned`
- `GET /v1/tickets/:id`
- `POST /v1/tickets/:id/assign`
- `PATCH /v1/tickets/:id/close`
- `GET /v1/tickets/:ticketId/comments`
- `POST /v1/tickets/:ticketId/comments`
- `GET /v1/tickets/:ticketId/attachments`
- `POST /v1/tickets/:ticketId/attachments`

## Padrao de consumo da API
- Cliente HTTP unico em `src/services/api.ts`
- `unwrapApiResponse` para contrato `{ success, data/error }`
- Hooks concentram queries e mutations
- Sem chamadas HTTP diretamente em componentes de pagina

## Convencoes arquiteturais obrigatorias
- Validacao de formularios com React Hook Form + Zod
- Paginas finas, sem regra pesada
- API centralizada em hooks/services
- Reuso de UI via `components/ui`
- Cache e invalidacao com TanStack Query
- Tipagem forte em `types`
