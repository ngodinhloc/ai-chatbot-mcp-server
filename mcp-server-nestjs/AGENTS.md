# AGENTS.md — mcp-server

## Purpose

NestJS service that implements the [Model Context Protocol](https://modelcontextprotocol.io) using `@modelcontextprotocol/sdk`. It exposes tools, resources, and prompts to MCP clients over stdio transport, while also running an HTTP server on port 3000.

## Key facts

- **Port:** 3000 (HTTP via NestJS)
- **MCP transport:** stdio (`StdioServerTransport`) — connected on startup in `McpService.connect()`
- **Framework:** NestJS with `ConfigModule` (typed config via `registerAs`)
- **DI:** NestJS native (no tsyringe)
- **Validation:** `class-validator` + `ValidationPipe` (global, strict: `whitelist`, `forbidNonWhitelisted`, `transform`)

## File map

```
src/
├── main.ts                            # Bootstrap — starts HTTP + connects MCP stdio transport
├── app.module.ts                      # Root module: ConfigModule, DatabaseModule, McpModule
├── app.controller.ts / app.service.ts # Root health/info endpoint
├── config/
│   ├── app.config.ts                  # app.* config namespace (port, mcp.serverName, mcp.serverVersion)
│   └── database.config.ts             # database.* config namespace
├── common/
│   ├── decorators/index.ts
│   ├── filters/http-exception.filter.ts
│   └── interceptors/logging.interceptor.ts
├── database/
│   ├── data-source.ts                 # TypeORM DataSource (standalone, for migrations CLI)
│   ├── database.module.ts             # TypeOrmModule.forRootAsync wired to ConfigService
│   └── migrations/                    # (empty — add migrations here)
└── mcp/
    ├── mcp.module.ts                  # Imports ToolsModule, ResourcesModule, PromptsModule
    ├── mcp.service.ts                 # Creates MCP Server, registers handlers, connects transport
    ├── tools/
    │   ├── tools.module.ts
    │   └── tools.service.ts           # listTools(), callTool()
    ├── resources/
    │   ├── resources.module.ts
    │   └── resources.service.ts       # listResources(), readResource(uri)
    └── prompts/
        ├── prompts.module.ts
        └── prompts.service.ts         # listPrompts(), getPrompt(name, args)
```

## Current MCP capabilities

**Tools**
| Name | Description | Args |
|---|---|---|
| `echo` | Echoes a message back | `message: string` |

**Resources**
| URI | MIME type | Description |
|---|---|---|
| `mcp://server/info` | `application/json` | Server name and status |

**Prompts**
| Name | Description | Args |
|---|---|---|
| `summarize` | Summarize provided text | `text: string` (required) |

## Patterns to follow

**Adding a tool:** edit `tools.service.ts` — add an entry to `listTools()` and a `case` in `callTool()`. No other files need changing.

**Adding a resource:** edit `resources.service.ts` — add an entry to `listResources()` and a `case` in `readResource()`.

**Adding a prompt:** edit `prompts.service.ts` — add an entry to `listPrompts()` and a `case` in `getPrompt()`.

**Adding a new NestJS module:** create the module under `src/`, import it into `AppModule` in `app.module.ts`.

**Config access:** inject `ConfigService` and use namespaced keys, e.g. `configService.get<string>('app.mcp.serverName')`. Never read `process.env` directly outside of config files.

**Error handling:** throw NestJS `NotFoundException`, `BadRequestException`, etc. — the global `HttpExceptionFilter` handles serialization.

## Dev commands

```bash
npm run start:dev    # nest start --watch (hot reload)
npm run start:debug  # nest start --debug --watch
npm run build        # nest build → dist/
npm run start:prod   # node dist/main
npm test             # jest
npm run migration:run    # TypeORM migrations via ts-node
npm run migration:revert # revert last migration
```

## Environment variables

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `development` | |
| `PORT` | `3000` | |
| `MCP_SERVER_NAME` | `mcp-server` | Sent in MCP handshake |
| `MCP_SERVER_VERSION` | `1.0.0` | Sent in MCP handshake |
| `DB_HOST` | (see database.config.ts) | No DB service in compose yet |
| `DB_PORT` | `5432` | |
| `DB_USERNAME` | `postgres` | |
| `DB_PASSWORD` | `postgres` | |
| `DB_DATABASE` | (see database.config.ts) | |

Config is loaded from `.env.local` then `.env` (see `ConfigModule.forRoot` in `app.module.ts`).
