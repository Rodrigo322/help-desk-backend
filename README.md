# Backend - Sistema de Chamados

## Visao geral
Backend em Node.js + TypeScript com Clean Architecture por modulo de dominio.

Camadas:
- `controllers`: HTTP (finos)
- `use-cases`: regra de negocio
- `repositories`: contratos + implementacao Prisma
- `factories`: injecao manual

## Stack
- Express
- Prisma 7 + PostgreSQL
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `zod`
- `multer`

## Evolucao Service Desk (Zendesk/ServiceNow-like)
### Status de ticket
- `NEW`
- `OPEN`
- `IN_PROGRESS`
- `PENDING`
- `ON_HOLD`
- `RESOLVED`
- `CLOSED`

### Regras principais
- Ticket nasce em `NEW`
- Ao assumir: `IN_PROGRESS`
- `RESOLVED` deve ocorrer antes de `CLOSED`

### Comentarios
- `Comment.isInternal` para nota interna
- Comentario interno permitido para `MANAGER` e `ADMIN`

### Audit log
Entidade `TicketAuditLog` registra:
- alteracao de status
- atribuicao
- alteracao de prioridade

### SLA basico
Ticket registra:
- `firstResponseDeadlineAt`
- `resolutionDeadlineAt`
- `firstResponseAt`
- `resolvedAt`

### Notificacoes
Notificacao com `eventType`:
- `CREATED`
- `ASSIGNED`
- `UPDATED`

## Estrutura (resumo)
```text
src/
  modules/
    auth/
    users/
    departments/
    tickets/
    comments/
    attachments/
    notifications/
    auditlogs/
```

## Rotas principais (/v1)
### Auth/User
- `POST /sessions`
- `POST /users` (`ADMIN` only)
- `GET /me`

### Departments
- `GET /departments`
- `POST /departments` (`ADMIN` only)

### Tickets
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/me/created`
- `GET /tickets/me/assigned`
- `GET /tickets/:id`
- `POST /tickets/:id/assign`
- `PATCH /tickets/:id/resolve`
- `PATCH /tickets/:id/close`
- `PATCH /tickets/:id/priority`
- `GET /tickets/:ticketId/audit-logs`

### Comments
- `POST /tickets/:ticketId/comments` (`isInternal` opcional)
- `GET /tickets/:ticketId/comments?includeInternal=true`

### Attachments
- `POST /tickets/:ticketId/attachments`
- `GET /tickets/:ticketId/attachments`

### Notifications
- `GET /notifications/me`

## Variaveis de ambiente
Ver `.env.example`.

Principais:
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`

## Seed (master)
Seed cria/atualiza usuario com permissao total (`ADMIN`) e vincula ao departamento configurado.
Em desenvolvimento local, tambem cria/atualiza um admin de compatibilidade: `admin@local.dev` (`admin123456`).

Variaveis recomendadas:
- `MASTER_NAME`
- `MASTER_EMAIL`
- `MASTER_PASSWORD`
- `MASTER_ROLE` (default `ADMIN`)
- `MASTER_DEPARTMENT`

## Comandos
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Convencoes obrigatorias
- Prisma somente em repository
- Use-case sem dependencia de Express
- Controller fino + Zod
- Composicao somente via factory
- Rotas versionadas em `/v1`
- Resposta padrao:
  - sucesso: `{ "success": true, "data": ... }`
  - erro: `{ "success": false, "error": { "message": "..." } }`
