# AGENTS.md — chatbot-backend

## Purpose

Express + TypeScript REST API providing a chat interface. Currently a stub — `ChatService.chat()` echoes the message back. Intended to be wired to an LLM or the mcp-server.

## Key facts

- **Port:** 4000
- **Route prefix:** `/api/`
- **DI container:** tsyringe (manual singleton registration in `src/container.ts`)
- **Routing:** `routing-controllers` decorators (`@JsonController`, `@Post`, `@Body`, etc.)

## File map

```
src/
├── server.ts                          # Entry point — creates app, starts listener
├── app.ts                             # Express setup, middleware, routing-controllers wiring
├── container.ts                       # tsyringe DI registrations (all singletons)
├── config/
│   └── env.ts                         # Typed env vars with defaults
├── common/
│   ├── errors/app-error.ts            # AppError, NotFoundError base classes
│   └── middleware/
│       ├── error-handler.ts           # Global error → JSON response
│       └── not-found.ts              # 404 fallback
├── database/
│   └── data-source.ts                 # TypeORM DataSource (no DB in compose yet)
└── modules/
    ├── health/
    │   └── healthcheck.controller.ts  # GET /api/health
    └── chat/
        ├── controllers/chat.controller.ts   # POST /api/chat
        └── services/chat.service.ts         # Business logic
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| POST | `/api/chat` | `{ message: string }` → `{ reply: string }` |

## Patterns to follow

**Adding a new module:**
1. Create `src/modules/<name>/controllers/<name>.controller.ts` — decorate with `@injectable()` and `@JsonController('/<name>')`.
2. Create `src/modules/<name>/services/<name>.service.ts` — decorate with `@injectable()`.
3. Register both as singletons in `src/container.ts`.
4. Add the controller to the `controllers` array in `src/app.ts`.

**Error handling:** throw `NotFoundError` or `AppError` (from `src/common/errors/app-error.ts`); the global middleware handles serialization. Do not call `res.status().json()` directly in controllers.

**Validation:** Use `class-validator` + `class-transformer` DTOs on `@Body()` parameters, or validate with `zod` inside the service. The `routing-controllers` default error handler is disabled — validation errors propagate to the custom error-handler middleware.

## Dev commands

```bash
npm run start:dev    # ts-node-dev with hot reload
npm run build        # tsc compile to dist/
npm run start        # run compiled dist/server.js
npm test             # jest
npm run migration:run    # run TypeORM migrations
npm run migration:revert # revert last migration
```

## Environment variables

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `development` | |
| `PORT` | `4000` | |
| `DB_HOST` | `localhost` | |
| `DB_PORT` | `5432` | |
| `DB_USERNAME` | `postgres` | |
| `DB_PASSWORD` | `postgres` | |
| `DB_DATABASE` | `ai_chatbot` | No DB service in compose yet |

Create a `.env` file at the root of this directory for local overrides.
