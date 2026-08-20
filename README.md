# Brewmate

Monorepo for the Brewmate specialty-coffee app: an Expo mobile client, a Fastify
API and the Zod contract they share.

> Conventions and the binding project rules live in [CLAUDE.md](./CLAUDE.md).
> Read that before writing code.

## Requirements

- Node.js >= 22
- pnpm >= 10 (`corepack enable`)
- A Neon PostgreSQL project with two branches (development + test)
- A Firebase project with a service account (for running the API; not needed for tests)

## Setup

```bash
pnpm install
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env
```

Fill in `server/.env`:

| Variable                                                                 | Where it comes from                                                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                                                           | Neon console -> your development branch -> Connection string (pooled, hostname contains `-pooler`)           |
| `DATABASE_URL_UNPOOLED`                                                  | same branch, direct endpoint (no `-pooler`). Used by migrations                                              |
| `TEST_DATABASE_URL`                                                      | Neon console -> your **test** branch. Tests truncate every table, so this must not be the development branch |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firebase console -> Project settings -> Service accounts -> Generate new private key                         |

Then apply the schema and start the API:

```bash
pnpm --filter @brewmate/server db:migrate
pnpm dev:server
curl http://localhost:3000/health
```

## Everyday commands

```bash
pnpm verify        # typecheck + lint + format check
pnpm test          # integration tests (needs TEST_DATABASE_URL)
pnpm dev:server    # API in watch mode
pnpm dev:frontend  # Expo dev server
```

## API

| Method | Path      | Auth              | Purpose                              |
| ------ | --------- | ----------------- | ------------------------------------ |
| GET    | `/health` | no                | liveness + database check            |
| GET    | `/me`     | Firebase ID token | current user, created on first login |
| PATCH  | `/me`     | Firebase ID token | update `displayName`                 |

Authenticated requests send `Authorization: Bearer <firebase id token>`. The API
verifies the token, maps `firebase_uid` to an internal user row (creating it the
first time) and answers with the shape defined in `@brewmate/shared`.

## Workspace

| Package    | Contents                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| `shared`   | `@brewmate/shared` - Zod schemas, inferred types, API paths, error codes |
| `server`   | `@brewmate/server` - Fastify, Drizzle, Firebase Admin, integration tests |
| `frontend` | `@brewmate/frontend` - Expo shell, design tokens, i18n skeleton          |
