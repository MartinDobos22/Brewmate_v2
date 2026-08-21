# Brewmate

A mobile companion for brewing specialty coffee. This repository is a pnpm
workspace holding the mobile app, the API and the contract they share.

**Current state:** monorepo skeleton + working backend + mobile app skeleton.
The app has navigation, a design system and the data plumbing; it has no product
features on purpose, and no authentication yet.

---

## 1. Repository layout

```
brewmate_v2/
├── frontend/          Expo + React Native + expo-router (app skeleton)
├── server/            Fastify + Drizzle + Firebase Admin API
├── shared/            @brewmate/shared - Zod schemas + inferred types
├── eslint.config.mjs  One flat config for the whole workspace
├── tsconfig.base.json Strict compiler options + cross-package path aliases
├── pnpm-workspace.yaml
└── CLAUDE.md          You are here. These rules are binding.
```

`shared` is the single source of truth for the API contract. A request or
response shape is defined there once, and both sides import it. If the app and
the API disagree about a field, the fix belongs in `shared`, never in a local
copy of the type.

---

## 2. Commands

Run from the repository root.

| Command                             | What it does                                    |
| ----------------------------------- | ----------------------------------------------- |
| `pnpm install`                      | Install the whole workspace                     |
| `pnpm typecheck`                    | `tsc --noEmit` in every package                 |
| `pnpm lint`                         | ESLint across the workspace (the project rules) |
| `pnpm format` / `pnpm format:check` | Prettier                                        |
| `pnpm verify`                       | typecheck + lint + format check                 |
| `pnpm test`                         | Tests in every package                          |
| `pnpm build`                        | Build every package                             |
| `pnpm dev:server`                   | API in watch mode                               |
| `pnpm dev:frontend`                 | Expo dev server                                 |

Server-only:

| Command                                      | What it does                                  |
| -------------------------------------------- | --------------------------------------------- |
| `pnpm --filter @brewmate/server db:generate` | Generate a migration from the Drizzle schema  |
| `pnpm --filter @brewmate/server db:migrate`  | Apply pending migrations                      |
| `pnpm --filter @brewmate/server db:studio`   | Drizzle Studio                                |
| `pnpm --filter @brewmate/server test`        | Integration tests (needs `TEST_DATABASE_URL`) |

---

## 3. BINDING PROJECT RULES

These apply to **every** change in this repository, in every future prompt.
They are enforced by ESLint as errors and they fail CI. Do not weaken a rule to
make code pass; change the code.

### Rule 1 - Zero tolerance for hardcoded values

No literal may appear in a component or in business logic except `0`, `1`,
`-1` and the empty string. Specifically forbidden:

- colours (`#6B4226`, `'white'`, `'rgba(...)'`)
- dimensions, padding, margin, radius, font size
- any user-visible text
- API paths and URLs
- time constants, limits, thresholds
- storage keys, query keys
- magic numbers of any kind (for example 21 days of resting time)

Everything goes through a named constant or a design token.

**Where values are allowed to be written down:**

| Kind of value                                        | Home                                               |
| ---------------------------------------------------- | -------------------------------------------------- |
| Colours, spacing, radii, typography                  | `frontend/src/theme/tokens/`                       |
| User-visible text                                    | `frontend/src/i18n/translations/`                  |
| API paths, header names, auth scheme                 | `shared/src/api/`                                  |
| Error codes and the error envelope                   | `shared/src/errors/`                               |
| Field limits shared by app and API                   | `shared/src/users/userFieldLimits.ts` and siblings |
| HTTP status codes, methods, server/database defaults | `server/src/constants/`                            |
| Log messages                                         | `server/src/logging/logMessages.ts`                |
| Client-facing error messages                         | `server/src/errors/errorMessages.ts`               |
| Anything read from the environment                   | `server/src/config/`, `frontend/src/config/`       |

### Rule 2 - Everything in folders, one file = one thing

No `utils.ts` holding everything. Every component, hook, service, type and
constant gets its own file, in a folder named after its domain, with an
`index.ts` re-export.

The one deliberate exception: a Zod schema and the type inferred from it
(`export type X = z.infer<typeof xSchema>`) live in the same file. The schema
_is_ the type; splitting them creates two things that can drift apart.

### Rule 3 - Strict TypeScript

No `any`. No `as` type assertion without a reason. `as const` is fine.
If an assertion is genuinely unavoidable, it needs an `eslint-disable-next-line`
with a comment explaining why it is safe.

### Rule 4 - Components stay under 150 lines

Longer than that means it is doing more than one thing. Split it.

### Rule 5 - No business logic in components or route handlers

Route handlers resolve the caller and delegate. Components render. Logic lives
in services (`server/src/modules/<domain>/<domain>Service.ts`).

### Rule 6 - API keys never in the frontend

Only `EXPO_PUBLIC_*` variables reach the bundle, and everything in the bundle is
readable by anyone who installs the app. Firebase _Admin_ credentials, database
URLs and any secret live in `server/.env` and nowhere else.

### Rule 7 - No inline styles in JSX

Styles go into a `StyleSheet.create` call in a sibling `<component>Styles.ts`
file, built exclusively from design tokens.

---

## 4. How the rules are enforced

`eslint.config.mjs` is the whole policy. Every rule below is `error`.

| Rule                                                                                            | Enforces                                |
| ----------------------------------------------------------------------------------------------- | --------------------------------------- |
| `@typescript-eslint/no-magic-numbers` (allows `0`, `1`, `-1`, including inside object literals) | Rule 1                                  |
| `no-restricted-syntax` - hex colour ban outside `frontend/src/theme/tokens/**`                  | Rule 1                                  |
| `no-restricted-syntax` - absolute URL ban (`http`, `ws`, `postgres`)                            | Rule 1                                  |
| `no-restricted-syntax` - `as` assertion ban (`as const` allowed)                                | Rule 3                                  |
| `react-native/no-color-literals`                                                                | Rule 1                                  |
| `react-native/no-inline-styles`                                                                 | Rule 7                                  |
| `react-native/no-raw-text`                                                                      | text outside `<Text>`                   |
| `react/jsx-no-literals`                                                                         | every string in JSX must come from i18n |
| `react-native/no-unused-styles`                                                                 | dead style objects                      |
| `@typescript-eslint/no-explicit-any`                                                            | Rule 3                                  |
| `@typescript-eslint/explicit-function-return-type`                                              | explicit contracts                      |
| `max-lines`, `max-lines-per-function` (150) on the frontend                                     | Rule 4                                  |
| `typescript-eslint` strict + stylistic **type-checked** presets                                 | Rule 3                                  |

Exemptions, and only these:

- `frontend/src/theme/tokens/**` - the only place a hex colour may exist.
- `**/constants/**` and the token folder - the only places a number may sit
  inside an object literal.
- `*.config.ts` / `*.config.js` / `eslint.config.mjs` - tooling, not application
  code; `no-magic-numbers` is off there.

Adding a new exemption is a change to this document, not a quiet edit to the
lint config.

---

## 5. App architecture

```
frontend/
├── app.json            Expo config: permissions, privacy manifest, icons, splash
├── assets/             Icon, adaptive icon, splash mark, favicon
└── src/
    ├── app/            expo-router routes - thin files that delegate to a feature
    ├── theme/          Tokens, composed theme, ThemeProvider, useTheme
    ├── constants/      config, routes, navigation, queryKeys, storageKeys, limits, brewing, http, time
    ├── i18n/           Slovak copy, split by domain under translations/sk/
    ├── components/
    │   ├── ui/         Button, Card, Text, Input, Chip, Sheet, ListItem, ChatBubble,
    │   │               Slider, NumberStepper, EmptyState, LoadingState, ErrorState,
    │   │               ValueDisplay - each its own folder
    │   └── layout/     Screen, AppProviders, RootStack, TabsNavigator, TabBarIcon
    ├── features/       one domain = one folder (home, inventory, brewing, chat,
    │                   onboarding, profile, designSystem)
    ├── hooks/          only genuinely global hooks
    ├── lib/            apiClient, queryClient, formatters
    ├── stores/         Zustand - UI state only
    └── types/
```

### Where things live, and why

- **Design tokens stay in `src/theme/tokens/`.** That path is the single lint
  exemption for colour literals (section 4). The composed theme, the provider
  and the hooks sit one level up in `src/theme/`, where a hex colour is still
  an error.
- **Routes live in `src/app/`**, not `frontend/app/`, so everything the app is
  made of stays under `src/`. A route file renders one screen component and
  nothing else - no logic, no layout.
- **Slovak copy is split by domain** under `src/i18n/translations/sk/`
  (`common`, `navigation`, `screens`, `errors`, `designSystem`) and merged in
  `sk/index.ts`. One file would break the 150-line limit. `SK_TRANSLATIONS` is
  the source of truth for the key list: every future locale is typed against it,
  so a missing translation is a type error.

### Theming

Colours depend on the active scheme, so a stylesheet cannot be a module-level
constant. Every component ships a `create<Component>Styles(theme)` factory in
its `<Component>.styles.ts`, and the component calls
`useThemedStyles(createXStyles)`, which memoises the result per theme. The rule
is unchanged - styles are built from tokens, in a sibling file, never inline.

Geometry that only exists at runtime (a slider fill width, an animated
transform) is built by a small named function exported from the same styles
file, so it is still not written inside the JSX.

### Shape language

A deliberate deviation from Material Design 3: MD3 gives buttons and chips a
pill shape; Brewmate does not. `RADIUS` is the raw scale
(`xs 4, sm 8, md 12, lg 16, xl 24, full`) and `SHAPE` maps each kind of element
onto one of them (`SHAPE.button = md`, `SHAPE.card = lg`, `SHAPE.sheet = xl`,
`SHAPE.avatar = full`). Components read `SHAPE`, never `RADIUS`, so the same
kind of element has the same radius everywhere.

### Data

- **TanStack Query** owns server state, persisted to AsyncStorage through
  `PersistQueryClientProvider`. Keys come from `constants/queryKeys.ts`, the
  storage key from `constants/storageKeys.ts`, every duration from
  `constants/limits.ts`.
- **Zustand** owns UI state only (theme preference, onboarding flag). Server
  data never enters the store.
- `lib/apiClient` is the only thing that talks to the API. Paths come from
  `@brewmate/shared` and every response is validated against the shared schema -
  a body that violates the contract throws, it does not resolve.
- Authentication is not wired yet. The client takes an `AuthTokenProvider` and
  currently runs with the anonymous one, which omits the header.

### The design system screen

`/design-system` is development only - in a production build the route
redirects home, and the way in from the profile screen is hidden. It renders
every token and every component, with a switch for light, dark, or both schemes
side by side. Without it there is no way to check that the pieces fit together.

### One inline lint exemption

`src/i18n/translationKeys.ts` carries a single `eslint-disable-next-line` for a
type assertion, with the reason written next to it: `Object.fromEntries` cannot
express "every key mapped onto itself". Rule 3 allows exactly this, and it is
the only one in the app.

---

## 6. Server architecture

```
server/src/
├── index.ts          Bootstrap: load env -> config -> dependencies -> listen
├── app/              buildApp (no listen, so tests can inject), DI wiring, shutdown
├── config/           Env schema (Zod), AppConfig, per-concern resolvers
├── constants/        HTTP status, methods, server + database defaults, time units
├── logging/          Pino options, redaction paths, log messages
├── db/               Drizzle client, schema, migrations
├── errors/           AppError, typed factories, error handler, not-found handler
├── auth/             Token verifier interface, Firebase implementation, auth plugin
├── modules/
│   ├── health/       healthService + healthRoutes
│   └── users/        repository -> service -> routes, plus row->contract mapper
└── types/            Fastify module augmentation
```

The dependency direction is one way:

```
routes -> service -> repository -> drizzle
```

A route handler never touches the database and never contains a rule. A service
never touches Fastify's request or reply.

### Dependency injection

`buildApp(dependencies)` takes `{ config, db, tokenVerifier }`. Production wiring
lives in `createAppDependencies`; integration tests pass a stub verifier. Nothing
in `src/` reaches for a global singleton.

### Auth flow

1. `Authorization: Bearer <firebase id token>`
2. `extractBearerToken` parses the header (401 if absent or malformed)
3. `TokenVerifier.verifyIdToken` validates it - Firebase Admin in production
4. `userService.provisionFromIdentity` maps `firebase_uid` to an internal user,
   creating the row on first login (an upsert, so two concurrent first requests
   cannot race into a duplicate key error)
5. the user is exposed as `request.currentUser`, read via `requireCurrentUser`

`TokenVerifier` is an interface on purpose: real Firebase ID tokens cannot be
minted in CI, and the HTTP layer must be testable without a live identity
provider.

### Error shape

Every non-2xx response, without exception:

```json
{
  "error": { "code": "UNAUTHORIZED", "message": "...", "details": null },
  "requestId": "req-1"
}
```

`code` comes from `ERROR_CODES` in `shared`. Clients branch on the code, never
on the message. Throw an `AppError` (via `unauthorizedError`, `notFoundError`,
`badRequestError`, `internalError`); the central error handler does the rest.

### Endpoints

| Method | Path      | Auth | Purpose                                       |
| ------ | --------- | ---- | --------------------------------------------- |
| GET    | `/health` | no   | liveness + database check (503 when degraded) |
| GET    | `/me`     | yes  | current user, auto-provisioned on first call  |
| PATCH  | `/me`     | yes  | update `displayName`                          |

Both request bodies and responses are validated against the shared Zod schemas.
A response that violates the contract is a 500, not a silent success.

---

## 7. Database

PostgreSQL hosted on **Neon**. There is no local database and no Docker Compose -
do not add one.

Two branches:

- development branch -> `DATABASE_URL` (pooled, hostname contains `-pooler`) and
  `DATABASE_URL_UNPOOLED` (direct, used by drizzle-kit and `db:migrate`)
- test branch -> `TEST_DATABASE_URL`

When `NODE_ENV=test` the config resolver picks `TEST_DATABASE_URL` and ignores
`DATABASE_URL`, so a test run can never truncate development data.

Schema changes: edit `server/src/db/schema/`, run `db:generate`, commit the
generated SQL in `server/drizzle/`, run `db:migrate`. Never hand-edit a
generated migration that has already been applied.

---

## 8. Testing

Integration tests only, running against the real Neon test branch through
`app.inject()` - no mocked database, no testcontainers (everything is hosted).

- `tests/setup/globalSetup.ts` migrates the test branch once per run
- `tests/setup/createTestContext.ts` boots the real app with a stub verifier
- `truncateTables` resets state between tests
- `fileParallelism` is off: all test files share one database branch

Tests are skipped in CI when `TEST_DATABASE_URL` is not configured, and fail
loudly when it is set but unreachable.

---

## 9. Environment and secrets

`.env` files are git-ignored; only `.env.example` is tracked. Never commit a
filled-in `.env`, a service account JSON or a connection string with a password.

- `server/.env` - database URLs, Firebase Admin credentials
- `frontend/.env` - `EXPO_PUBLIC_*` only (see Rule 6)

---

## 10. WebStorm

- **Package manager:** Settings -> Languages & Frameworks -> Node.js ->
  Package manager -> `pnpm`.
- **Cross-package autocomplete** works out of the box: `tsconfig.base.json`
  maps `@brewmate/shared` to `shared/src`, so Go To Definition lands on the
  source, while Node and Metro resolve the built package at runtime.
- `.idea/` is git-ignored on purpose - IDE state is personal, and the type
  resolution above is IDE-independent.

---

## 11. Definition of done

Before any change is considered finished:

1. `pnpm verify` is green (typecheck + lint + format).
2. `pnpm test` is green, or the reason it cannot run is stated explicitly.
3. No new lint exemption was added without updating section 4 of this document.
4. New values live in a constants/tokens/i18n file, not at their use site.
5. New shapes crossing the API boundary live in `shared`.
