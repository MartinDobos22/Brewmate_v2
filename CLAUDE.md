# Brewmate

A mobile companion for brewing specialty coffee. This repository is a pnpm
workspace holding the mobile app, the API and the contract they share.

**Current state:** monorepo skeleton + working backend + mobile app skeleton
with authentication, plus the complete data layer: the PostgreSQL schema, the
REST API for every entity and the TanStack Query hooks that talk to it. There
is still no AI and no product UI on purpose.

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
| `pnpm --filter @brewmate/server db:seed`     | Fill the two catalogues (idempotent)          |
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
| Firebase and OAuth error codes                       | the `constants/` folder of the owning package      |
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
    ├── features/       one domain = one folder (auth, home, inventory, brewing,
    │                   chat, tasteProfile, bagEvaluations, onboarding, profile,
    │                   designSystem); each has services/ for the API calls and
    │                   hooks/ for the queries and mutations over them
    ├── hooks/          only genuinely global hooks, incl. useEntityMutation
    ├── lib/            apiClient, firebase, queryClient, queryCache, formatters
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
- `lib/apiClient` takes an `AuthTokenProvider` and runs with the Firebase one:
  every request carries `Authorization: Bearer <id token>`, and a 401 is retried
  exactly once with a force-refreshed token before it reaches the caller.

**Optimistic updates, and where they stop.** Two hooks in
`hooks/useEntityMutation/` divide every write in the app:

- `useOptimisticEntityMutation` is for changes whose outcome is not in doubt -
  pinning a recipe, archiving a bag, weighing out a dose, renaming a set,
  marking a bag as bought. The patch goes into every cached page and the detail
  entry, the previous contents are kept, a failure puts them back, and the
  domain is refetched afterwards so the guess never outlives the answer.
- `useInvalidatingMutation` is for everything the server decides: logging a brew
  (the bag comes from the recipe and the learning weight is priced from the
  declared constraints), adding a taste event (which re-folds the whole
  profile), contributing a grinder (which may already exist), deleting a recipe
  (which is refused once it has been brewed).

The line is deliberate. Guessing at a value the API is about to compute means
showing the user a number that is about to change underneath them, and the
numbers in question are exactly the ones this product exists to get right.

### The design system screen

`/design-system` is development only - in a production build the route
redirects home, and the way in from the profile screen is hidden. It renders
every token and every component, with a switch for light, dark, or both schemes
side by side. Without it there is no way to check that the pieces fit together.

### Authentication

The app signs in with **email + password, Google and Apple** - Apple is not
optional next to Google, an app that offers one third-party login without
Apple's does not pass review.

```
src/features/auth/
├── constants/   auth status, provider ids, Firebase error codes
├── services/    one file per action; the only place a provider error is read
├── context/     AuthProvider + useAuthSession, fed by onIdTokenChanged
├── hooks/       useAuthMutation/useAuthAction, the social hooks, the route guard
└── components/  the four screens, the shared form, the account card, AuthGate
```

- **The flow is splash -> sign-in/registration -> app.** `AuthGate` holds the
  splash screen until Firebase has said who the user is, so the first screen a
  user sees is already the right one. `useProtectedRoute` then keeps the visible
  screen and the session in step in both directions.
- **Tokens refresh themselves.** Firebase renews an ID token shortly before it
  expires and `firebaseTokenProvider` hands the current one to every request.
  The app tracks no expiry of its own.
- **Sessions survive a cold start** because `getFirebaseAuth` wires Firebase Auth
  to AsyncStorage. Without an explicit persistence the React Native build keeps
  the session in memory only.
- **The backend user is provisioned by the first `/me` call**, which `AuthGate`
  makes as soon as anyone signs in.
- **Errors are Slovak sentences.** `resolveAuthErrorKey` is the only code that
  reads `error.code`; every screen renders a translation key. A raw
  `auth/invalid-credential` must never reach the interface.
- **Being offline is a state, not a failure.** `useIsOnline` puts a notice above
  the form and blocks the submit button before an attempt is made; the network
  error code is mapped as a backstop.
- **Deleting the account is in the app**, as Apple has required since 2022 of
  any app that can create one. `DELETE /me` removes the stored data and the
  Firebase identity, and the app signs out and empties the query cache.

Google Sign-In is optional: a build without `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID`
hides the button rather than failing when it is pressed. Apple's button hides
itself wherever the platform does not support it.

### One typing augmentation

`src/types/firebaseAuth.d.ts` declares `getReactNativePersistence`, which the
React Native bundle of `firebase/auth` exports at runtime but leaves out of the
package's published typings. It declares what is already there rather than
asserting a type, so Rule 3 is untouched.

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
├── auth/             Token verifier + identity deleter, Firebase implementations, auth plugin
├── modules/          one domain each: repository -> service -> routes + mapper
│   ├── health/       healthService + healthRoutes
│   ├── users/        the account behind a Firebase identity
│   ├── tasteProfiles/ profile, its audit trail and the fold that rebuilds it
│   ├── brewMethods/  the method catalogue, as data
│   ├── grinders/     the shared grinder catalogue, extensible by users
│   ├── equipment/    what somebody owns
│   ├── equipmentSets/ saved combinations of it
│   ├── coffeeBags/   the cupboard
│   ├── bagEvaluations/ "should I buy this bag?", asked and answered
│   ├── recipes/      one way of brewing one coffee
│   ├── recipeChat/   the conversation about a recipe
│   ├── brewLogs/     cups that were actually brewed
│   └── aiUsage/      model calls, recorded for cost
└── types/            Fastify module augmentation
```

The dependency direction is one way:

```
routes -> service -> repository -> drizzle
```

A route handler never touches the database and never contains a rule. A service
never touches Fastify's request or reply.

### Dependency injection

`buildApp(dependencies)` takes `{ config, db, tokenVerifier, identityDeleter }`.
Production wiring lives in `createAppDependencies`; integration tests pass a stub
verifier and a recording deleter. Nothing in `src/` reaches for a global
singleton.

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
provider. `IdentityDeleter` is separate for the same reason - it is the one
thing the API does _to_ Firebase rather than _with_ it.

### Deleting an account

`DELETE /me` erases the stored data first and the Firebase identity second. If
the identity call then fails, the request fails and a retry converges: the next
authenticated call re-provisions an empty row, deletes it again and retries the
identity. The reverse order could strand personal data behind an identity nobody
can sign in as. Deleting an account that is already partly gone is a success.

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

`/health` is the only unauthenticated route. Everything else requires a Firebase
ID token and is scoped to the caller _in the WHERE clause_ - a row belonging to
somebody else answers with the same 404 as a row that does not exist, so the API
is not an oracle for other people's ids.

| Method           | Path                         | Purpose                                          |
| ---------------- | ---------------------------- | ------------------------------------------------ |
| GET              | `/health`                    | liveness + database check (503 when degraded)    |
| GET/PATCH/DELETE | `/me`                        | the account; PATCH edits name, water, onboarding |
| GET              | `/taste-profile`             | the profile, neutral until something teaches it  |
| GET/POST         | `/taste-profile/events`      | the audit trail; POST is safe to retry           |
| POST             | `/taste-profile/recompute`   | rebuild the profile from its events              |
| GET              | `/brew-methods`              | the method catalogue                             |
| GET/POST         | `/grinders`, `/grinders/:id` | the grinder catalogue, extensible by users       |
| CRUD             | `/equipment`                 | what the user owns                               |
| CRUD             | `/equipment-sets`            | saved combinations of it                         |
| CRUD             | `/coffee-bags`               | the cupboard; DELETE archives, it does not erase |
| GET/POST/PATCH   | `/bag-evaluations`           | verdicts on bags seen in a shop                  |
| CRUD             | `/recipes`                   | recipes; DELETE is refused once one was brewed   |
| GET/POST         | `/recipes/:id/messages`      | the conversation about a recipe                  |
| CRUD             | `/brew-logs`                 | cups actually brewed                             |
| GET              | `/ai-usage`                  | this account's model usage; read-only by design  |

Every list endpoint takes `limit` and `offset` and answers
`{ items, limit, offset, hasMore }`. `hasMore` comes from reading one row beyond
the page rather than from a `count(*)`, which on a growing table would cost more
than the page it describes.

Both request bodies and responses are validated against the shared Zod schemas.
A response that violates the contract is a 500, not a silent success.

---

## 7. Database

PostgreSQL hosted on **Neon**. There is no local database and no Docker Compose -
do not add one.

### The schema, and why it looks like this

Thirteen tables. Everything a user owns carries
`user_id references users(id) on delete cascade`, which is what makes
`DELETE /me` erase an account rather than merely disown it. The decisions worth
knowing before changing anything:

- **Closed sets the code branches on are `pgEnum`s** built from the value lists
  in `shared/src/enums/`, so a column cannot accept what the contract rejects.
  Anything only a human reads - a coffee's process, its variety - is `text`,
  because that vocabulary belongs to the world rather than to the code.
- **`brew_methods` are rows, not an enum.** Nothing branches on `key`; adding a
  method is an insert. Retired methods are flagged, never deleted, because
  recipes point at them.
- **`taste_profiles` has `user_id` as its primary key.** A profile is a
  singleton per account, so a second one is impossible rather than unlikely.
- **`taste_profile_events` is append-only and the profile is its fold.** Adding
  an event replays the whole trail rather than patching the row, so the profile
  is always exactly what its evidence says. `source_ref`, with a partial unique
  index on `(user_id, source, source_ref)`, is what makes a repeated submission
  count once.
- **Pinned recipes need two partial unique indexes, not one.** `bag_id` is
  nullable for a quick brew, and SQL treats two NULLs as different values - a
  single index over `(user, bag, method)` would let every bagless recipe stay
  pinned. Pinning itself is done transactionally by the service; the indexes are
  the backstop.
- **`brew_logs.profile_learning_weight` is computed once, on the way in**, from
  the constraints declared for that brew. Derived on read, it would rewrite
  history: the day somebody buys a kettle with temperature control, every
  disappointing cup they made at a cabin would turn into evidence about their
  taste.
- **`grinders_catalog.created_by_user_id` is nulled, not cascaded.** The entry
  is shared data other people's equipment points at; only the attribution is
  personal.
- **`equipment_sets.equipment_ids` is `jsonb`,** so the database cannot enforce
  those references and the service does it instead: every id must exist and
  belong to the caller, and deleting a piece of gear prunes it out of that
  user's sets. This is the one place where code stands in for the database.
- **`jsonb` only where the shape is genuinely open** - brew parameters,
  constraints, calibration curves, onboarding state. Every one of them is still
  typed by a Zod schema in `shared` and validated at the edge.
- **`ai_usage_logs.cost_estimate` is `numeric`** and travels as a decimal
  string. Everything else here is a measurement where `real` is right; these
  rows get summed over months, and a float sum of fractions of a cent is wrong
  in the way nobody notices until the invoice.
- **`roast_date` is a `date`.** A roast date has no time and no timezone;
  stored as `timestamptz` the resting window would come out a day wrong.

Foreign keys cascade rather than restrict even where a rule says "you cannot
delete this" - a `restrict` anywhere in the graph would make deleting an account
fail against its own history. Those rules live in the services, which is where
they can answer with a 409 instead of a constraint violation.

Reference data lives in `server/src/db/seed/`. `db:seed` is idempotent: methods
are matched on `key`, grinders on brand and model, so it can be run against a
fresh branch or an existing one with the same result.

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
- `tests/setup/testApi.ts` cuts the `app.inject` boilerplate out of every test
- `truncateTables` resets state between tests, naming only the roots -
  everything a user owns cascades from `users`
- `fileParallelism` is off: all test files share one database branch

The tests are written around the schema decisions rather than around the CRUD:
that both pinned-recipe rules hold (including the bagless one SQL would
otherwise let through), that constraints discount a brew's learning weight and
correcting them re-prices it, that a repeated questionnaire counts once, that a
recompute reproduces the stored profile exactly, that deleting an account takes
everything but leaves a contributed catalogue entry without its author, and that
one account's rows are invisible to another.

Tests are skipped in CI when `TEST_DATABASE_URL` is not configured, and fail
loudly when it is set but unreachable.

---

## 9. Environment and secrets

`.env` files are git-ignored; only `.env.example` is tracked. Never commit a
filled-in `.env`, a service account JSON or a connection string with a password.

- `server/.env` - database URLs, Firebase Admin credentials
- `frontend/.env` - `EXPO_PUBLIC_*` only (see Rule 6): the API base URL, the
  public Firebase _client_ configuration and the Google OAuth client IDs. None
  of those are secrets; all of them identify rather than authorise.

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
