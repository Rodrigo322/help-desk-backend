# Backend - Sistema de Chamados

## Visão geral
Backend em Node.js com TypeScript para gerenciamento de chamados (tickets), comentários e anexos, com autenticação JWT e arquitetura modular baseada em Clean Architecture.

O projeto separa claramente HTTP, regra de negócio, acesso a dados e composição de dependências:

- `controllers`: camada HTTP (entrada/saída)
- `use-cases`: regra de negócio
- `repositories`: contratos + implementação Prisma
- `factories`: criação manual de use-cases/controllers

## Stack
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- JWT (`jsonwebtoken`)
- Hash de senha (`bcryptjs`)
- Upload de arquivos (`multer`)
- Validação de entrada (`zod`)
- Testes unitários (`vitest`)

## Estrutura de pastas
```text
src/
  app.ts
  server.ts
  routes.ts
  configs/
    multer.ts
  database/
    prisma.ts
  middlewares/
    authenticate.ts
  modules/
    auth/
      controllers/
      factories/
      use-cases/
      routes.ts
    users/
      controllers/
      factories/
      repositories/
        prisma/
      use-cases/
      routes.ts
    tickets/
      controllers/
      entities/
      errors/
      factories/
      repositories/
        prisma/
      use-cases/
      routes.ts
    comments/
      controllers/
      factories/
      repositories/
        prisma/
      use-cases/
      routes.ts
    attachments/
      controllers/
      factories/
      repositories/
        prisma/
      use-cases/
      routes.ts
  shared/
    errors/
    http/

prisma/
  schema.prisma
  migrations/
  seed.ts

tests/
  modules/
    auth/
    users/
    tickets/
    comments/
```

## Como rodar o projeto
### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
Crie um `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Rodar migrations
```bash
npm run prisma:migrate
```

### 4. Gerar Prisma Client (se necessário)
```bash
npm run prisma:generate
```

### 5. Executar seed inicial
```bash
npm run seed
```

Alternativa via Prisma:
```bash
npm run prisma:seed
```

### 6. Subir servidor em desenvolvimento
```bash
npm run dev
```

Servidor padrão: `http://localhost:3333`

## Configuração do `.env`
Variáveis mínimas:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db?schema=public"
JWT_SECRET="super-secret"
```

Variáveis para seed de admin:

```env
ADMIN_NAME="Local Admin"
ADMIN_EMAIL="admin@local.dev"
ADMIN_PASSWORD="Admin@123456"
```

Comportamento do seed:
- Se `ADMIN_*` estiver completo, usa esses valores.
- Em ambiente local, se não estiver completo, usa fallback seguro de desenvolvimento.
- Em produção (`NODE_ENV=production`), `ADMIN_*` é obrigatório.

## Rotas principais (`/v1`)
### Health/Auth/User
- `GET /v1/health`
- `POST /v1/users` (sign-up)
- `POST /v1/sessions` (sign-in)
- `GET /v1/me` (autenticado)

### Tickets
- `POST /v1/tickets`
- `GET /v1/tickets`
- `GET /v1/tickets/:id`
- `PATCH /v1/tickets/:id/status`

Filtros/paginação em `GET /v1/tickets`:
- `status` (`OPEN`, `IN_PROGRESS`, `CLOSED`)
- `priority` (`LOW`, `MEDIUM`, `HIGH`)
- `userId`
- `page` (default `1`)
- `pageSize` (default `10`, max `100`)

### Comments
- `POST /v1/tickets/:ticketId/comments`
- `GET /v1/tickets/:ticketId/comments`

### Attachments
- `POST /v1/tickets/:ticketId/attachments` (`multipart/form-data`, campo `file`)
- `GET /v1/tickets/:ticketId/attachments`

Arquivos são servidos em:
- `GET /uploads/:fileName`

## Padrão de resposta da API
### Sucesso
```json
{
  "success": true,
  "data": {}
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "message": "..."
  }
}
```

## Convenções arquiteturais obrigatórias
- Módulos em minúsculo (`auth`, `users`, `tickets`, `comments`, `attachments`).
- Controllers devem ser finos e apenas traduzir request/response.
- Validação de entrada no controller com Zod (`body`, `params`, `query`).
- Use-cases não dependem de Express.
- Regras de negócio ficam em use-cases.
- Prisma só pode ser usado em repositórios (implementações `prisma`).
- Todo use-case deve ser criado via factory.
- Rotas sempre versionadas com prefixo `/v1`.
- Tratamento global de erros centralizado em `src/shared/http/global-error-handler.ts`.

## Testes
Rodar testes unitários:
```bash
npm run test
```

Modo watch:
```bash
npm run test:watch
```
