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
- Firebase Authentication with the Email/Password, Google and Apple providers enabled

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

## Deployment

The API is one stateless process: `server/Dockerfile` builds it, and everything
with state in it - the database, the identities, the photographs, the model - is
hosted elsewhere.

```bash
docker build -f server/Dockerfile -t brewmate-api .   # from the repository root
```

| Document                                                                               | Answers                                                                 |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [docs/release/backend-hosting.md](./docs/release/backend-hosting.md)                   | Where the API runs, what it needs, migrations, health checks, logs      |
| [docs/release/go-live.md](./docs/release/go-live.md)                                   | The order the accounts, the database, the API, the builds and the store |
| [docs/release/eas.md](./docs/release/eas.md)                                           | Build profiles, channels, what an over-the-air update may carry         |
| [docs/release/ios-submission-checklist.md](./docs/release/ios-submission-checklist.md) | The things that fail a first submission                                 |

## API

| Method | Path      | Auth              | Purpose                                     |
| ------ | --------- | ----------------- | ------------------------------------------- |
| GET    | `/health` | no                | liveness + database check                   |
| GET    | `/me`     | Firebase ID token | current user, created on first login        |
| PATCH  | `/me`     | Firebase ID token | update `displayName`                        |
| DELETE | `/me`     | Firebase ID token | erase the account and its Firebase identity |

Authenticated requests send `Authorization: Bearer <firebase id token>`. The API
verifies the token, maps `firebase_uid` to an internal user row (creating it the
first time) and answers with the shape defined in `@brewmate/shared`.

`DELETE /me` removes the stored data and then the Firebase identity, so an
account deleted from inside the app is gone from both sides.

## App

```bash
pnpm dev:frontend   # Expo dev server
```

The app is a skeleton: four tabs (Domov, Moja káva, Variť, Profil), all empty on
purpose. What is real is the plumbing - expo-router navigation, the Material
Design 3 design system in `frontend/src/theme`, a persisted TanStack Query
cache, a Zustand store for UI state and an API client built on the shared
contract.

### Signing in

Firebase Authentication with three ways in: **e-mail and password, Google and
Apple**. The splash screen holds until Firebase says who the user is, then the
app shows either the sign-in screen or the tabs. Sessions survive a cold start,
ID tokens refresh themselves, and every request carries the current one.

The app also does password reset, e-mail verification, signing out and deleting
the account - the last one required by Apple of any app that can create one.
Failures are Slovak sentences, never a raw `auth/...` code, and being offline is
shown before an attempt is made rather than after it fails.

Fill in `frontend/.env` from `frontend/.env.example`:

| Variable                                                          | Where it comes from                                                                                      |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL`                                        | where the API is running                                                                                 |
| `EXPO_PUBLIC_FIREBASE_*`                                          | Firebase console -> Project settings -> General -> Your apps -> SDK setup                                |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and the iOS/Android client IDs | Firebase console -> Authentication -> Sign-in method -> Google, then Google Cloud for the native clients |

None of these are secrets - they identify the project rather than authorise
anything, which is why they may live in the bundle at all. Leaving the Google
client IDs empty ships a build without the Google button.

Sign in with Apple and Google Sign-In both need a development build
(`npx expo run:ios` / EAS), not Expo Go: Apple's button is a native component,
and the Google flow returns to the app through its own scheme.

Every user-visible string comes from `frontend/src/i18n/translations/sk/`.
The UI is Slovak; the code is English.

In a development build the profile tab opens a **Design system** screen that
shows every token and component in light and dark side by side. It redirects
home in a production build.

## Workspace

| Package    | Contents                                                                   |
| ---------- | -------------------------------------------------------------------------- |
| `shared`   | `@brewmate/shared` - Zod schemas, inferred types, API paths, error codes   |
| `server`   | `@brewmate/server` - Fastify, Drizzle, Firebase Admin, integration tests   |
| `frontend` | `@brewmate/frontend` - Expo app skeleton: expo-router, design system, i18n |
