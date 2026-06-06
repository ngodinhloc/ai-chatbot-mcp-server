# AGENTS.md — user-service

## Purpose

Express + TypeScript REST API that manages user profiles. It is the only service with an active PostgreSQL database in `docker-compose.yml`. Exposes read-only profile data (skills, qualifications, experience) by user UUID.

## Key facts

- **Port:** 4001
- **Route prefix:** `/api/`
- **DI container:** tsyringe (manual singleton registration in `src/container.ts` and `src/modules/users/container.ts`)
- **Routing:** `routing-controllers` decorators
- **Database:** PostgreSQL — `user_service` db on `user-service-db` (Docker service)

## File map

```
src/
├── server.ts                          # Entry point
├── app.ts                             # Express setup, middleware, routing-controllers wiring
├── container.ts                       # Root tsyringe registrations
├── config/
│   └── env.ts                         # Typed env vars (DB_HOST, DB_PORT, etc.)
├── common/
│   ├── errors/app-error.ts            # AppError, NotFoundError
│   └── middleware/
│       ├── error-handler.ts           # Global error → JSON
│       └── not-found.ts              # 404 fallback
├── database/
│   ├── data-source.ts                 # TypeORM DataSource
│   └── migrations/
│       └── 1748390400000-CreateUserTables.ts  # Creates users, skills, qualifications, experiences tables
└── modules/
    ├── health/
    │   └── healthcheck.controller.ts  # GET /api/health
    └── users/
        ├── container.ts               # Registers user module singletons
        ├── controllers/
        │   └── user.controller.ts     # GET endpoints
        ├── services/
        │   └── user.service.ts        # Business logic + user existence guard
        ├── repositories/
        │   ├── user.repository.ts
        │   ├── skill.repository.ts
        │   ├── qualification.repository.ts
        │   └── experience.repository.ts
        └── entities/
            ├── user.entity.ts
            ├── skill.entity.ts
            ├── qualification.entity.ts
            └── experience.entity.ts
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET | `/api/users/:id/profile` | Full user profile (`User` entity) |
| GET | `/api/users/:id/skills` | User's skills (`Skill[]`) |
| GET | `/api/users/:id/qualifications` | User's qualifications (`Qualification[]`) |
| GET | `/api/users/:id/experience` | User's work experiences (`Experience[]`) |

All endpoints return 404 if the user does not exist.

## Data model

```
users
  id (uuid PK), firstName, lastName, email (unique), bio, avatarUrl, createdAt, updatedAt
  ↳ skills        (userId FK, name, level: beginner|intermediate|advanced|expert, yearsOfExperience)
  ↳ qualifications (userId FK, title, institution, field, startDate, endDate, description)
  ↳ experiences   (userId FK, company, position, startDate, endDate, current, description)
```

All child tables cascade-delete when the parent user is deleted.

## Patterns to follow

**Adding a new endpoint:**
1. Add a method to `user.service.ts` (always call `assertUserExists()` first if the endpoint is user-scoped).
2. Add a route method to `user.controller.ts`.
3. No changes needed to `container.ts` unless you add a new service class.

**Adding a new entity/table:**
1. Create the entity in `src/modules/users/entities/`.
2. Create a repository in `src/modules/users/repositories/`.
3. Register the repository in `src/modules/users/container.ts`.
4. Generate and run a migration (do not rely on `synchronize` in production).

**Repository pattern:** repositories are thin wrappers around TypeORM `Repository<T>`. Keep query logic in repositories, business logic (e.g. existence guards) in services.

**Error handling:** throw `NotFoundError` from `src/common/errors/app-error.ts`. Do not use `res.status().json()` in controllers.

## Migrations

The only service with an active migration. Run from this directory:

```bash
npm run migration:run      # apply all pending migrations
npm run migration:revert   # revert last migration
npm run migration:generate -- src/database/migrations/<Name>  # generate from entity diff
```

`synchronize` is `true` in development mode (auto-syncs schema) and `false` in production (use migrations only).

## Dev commands

```bash
npm run start:dev    # ts-node-dev with hot reload
npm run build        # tsc compile to dist/
npm run start        # run compiled dist/server.js
npm test             # jest
```

## Environment variables

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `development` | Controls `synchronize` and query logging |
| `PORT` | `4001` | |
| `DB_HOST` | `localhost` | `user-service-db` when running in Docker |
| `DB_PORT` | `5432` | |
| `DB_USERNAME` | `postgres` | |
| `DB_PASSWORD` | `postgres` | Docker compose uses `admin` |
| `DB_DATABASE` | `user_service` | |

Create a `.env` file at the root of this directory for local overrides. Match `DB_PASSWORD` to `docker-compose.yml` (`admin`) when running against the Dockerized DB.
