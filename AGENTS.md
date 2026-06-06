# AGENTS.md — ai-chatbot (root)

## Workspace overview

A complete AI Chatbot powered by Claude LLM and the Model Context Protocol (MCP). Three backend services and one frontend, all orchestrated by Docker Compose.

| Service | Directory | Port | Framework | Database |
|---|---|---|---|---|
| chatbot-frontend-nextjs | `chatbot-frontend-nextjs/` | 3001 | Next.js 15 | — |
| chatbot-backend-express | `chatbot-backend-express/` | 4000 | Express | PostgreSQL `ai_chatbot` (host 5433) |
| mcp-server-nestjs | `mcp-server-nestjs/` | 3000 | NestJS | — |
| user-service-express | `user-service-express/` | 4001 | Express | PostgreSQL `user_service` (host 5432) |

## Repository layout

```
ai-chatbot/
├── docker-compose.yml           # Orchestrates all services + two postgres DBs
├── .env                         # Root env — holds ANTHROPIC_API_KEY (never commit)
├── chatbot-frontend-nextjs/
├── chatbot-backend-express/
├── mcp-server-nestjs/
└── user-service-express/
```

## Inter-service relationships

```
chatbot-frontend-nextjs
  → proxies /api/* → chatbot-backend-express:4000

chatbot-backend-express
  → Anthropic Claude API (tool-calling loop)
  → POST http://mcp-server-nestjs:3000/mcp/tools/call  (MCP tool calls)

mcp-server-nestjs
  → GET http://user-service-express:4001/api/users/:id/*  (fetches user data)

user-service-express
  → user-service-db (PostgreSQL)

chatbot-backend-express
  → chatbot-backend-db (PostgreSQL)
```

`mcp-server-nestjs` has **no database**. It is a pure HTTP proxy that translates MCP tool calls into `user-service-express` API calls, passing `user_id` from the execution context.

## Startup dependency order

Docker Compose enforces this chain:

```
user-service-db (healthy)
  → user-service-express
      → mcp-server-nestjs

chatbot-backend-db (healthy)
  → chatbot-backend-express (healthy — curl /api/health)
      → chatbot-frontend-nextjs
```

`chatbot-backend-express` exposes a healthcheck (`GET /api/health`). The frontend uses `condition: service_healthy` so it only starts once migrations have run and the backend is accepting traffic.

## Docker Compose

```bash
docker compose up --build          # build and start everything
docker compose up --build -d       # detached
docker compose down                # stop and remove containers
docker compose logs -f <service>   # tail logs for one service
```

## Shared conventions across all services

- **Language:** TypeScript strict mode
- **ORM:** TypeORM with `DataSource` (only `chatbot-backend-express` and `user-service-express` use a DB)
- **Env config:** `dotenv` loaded via `src/config/env.ts`; all env vars have safe defaults for local dev
- **Error handling:** Custom `AppError` / `NotFoundError` classes in `src/common/errors/`; a global error-handler middleware catches and formats them
- **Security:** `user_id` is always sourced from `execution_context`, never from LLM tool arguments

## Per-service AGENTS.md

Each service directory has its own AGENTS.md with architecture details, file map, and agent instructions specific to that service.
