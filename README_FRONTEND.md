# Arquitetura do Frontend — Sistema de Chamados

## 1. Objetivo

Este frontend será responsável por:

- autenticação de usuários
- listagem de chamados
- criação de chamados
- visualização de detalhes
- comentários
- anexos
- filtros e paginação

A aplicação deve consumir o backend já existente, respeitando os endpoints `/v1`.

---

## 2. Stack obrigatória

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS

---

## 3. Princípios arquiteturais

### 3.1 Separação de responsabilidades

A aplicação deve seguir separação clara entre:

- páginas
- componentes reutilizáveis
- hooks
- contexto de autenticação
- schemas de validação
- serviços HTTP
- tipos
- utilitários

### 3.2 Regras obrigatórias

- componentes de página não devem concentrar regra de negócio pesada
- chamadas HTTP não devem ficar espalhadas nos componentes
- validação deve usar Zod
- formulários devem usar React Hook Form
- consumo de API deve usar Axios centralizado
- cache e busca de dados devem usar TanStack Query
- autenticação deve ser centralizada em contexto próprio
- rotas privadas devem ser protegidas

---

## 4. Estrutura de pastas

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
      button.tsx
      input.tsx
      textarea.tsx
      select.tsx
      card.tsx
      badge.tsx
      loading.tsx
      empty-state.tsx
      error-state.tsx
    forms/
    layout/
      app-layout.tsx
      sidebar.tsx
      header.tsx

  services/
    api.ts

  hooks/
    use-auth.ts
    use-sign-in.ts
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

  types/
    auth.ts
    ticket.ts
    comment.ts
    attachment.ts
    api.ts

  utils/
    storage.ts
    format-date.ts
    format-status.ts
    format-priority.ts
```
