# Hosting the API

## Is it ready to be hosted?

Yes. The API is a stateless Node process that reads everything from the
environment, and every property a managed host requires of one is already true
in this repository. Each of these was checked by running the built server -
`node server/dist/index.js` - rather than by reading the source:

| What a host needs                        | What the API does                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Bind an injected port, on all interfaces | `HOST` defaults to `0.0.0.0`, `PORT` comes from the environment                                                |
| Configuration from the environment       | `envSchema` is the complete list; a missing `.env` file is normal, not an error                                |
| A health endpoint                        | `GET /health` pings the database - `200` with `status: ok`, `503` with `database: down`                        |
| Survive a redeploy                       | `SIGTERM` drains in-flight requests, releases the pool and exits; a hung shutdown is forced after 10 seconds   |
| Logs it can collect                      | Pino JSON on stdout, with authorization headers and cookies already redacted                                   |
| No local state                           | Nothing is written to disk, no session is held in memory, so a second instance changes nothing                 |
| Schema changes it can run                | A migration CLI separate from the server, with the SQL committed in `server/drizzle/`                          |
| Degrade rather than refuse to start      | No `ANTHROPIC_API_KEY` means `/ai/*` answers 503 and the rest works; no `SENTRY_DSN` means nothing is reported |

What is _not_ ready has nothing to do with the code. It is the set of things
only a console can produce: a production Neon branch, a production Firebase
project and its service account key, an Anthropic key, an account with a host,
and the `api.brewmate.app` hostname that `frontend/eas.json` already points
production builds at. [`go-live.md`](./go-live.md) is the order to do them in.

## What actually has to be hosted

One process. Everything with state in it is already somebody else's problem:

| Piece                 | Where it lives               | Already true today                             |
| --------------------- | ---------------------------- | ---------------------------------------------- |
| The database          | Neon                         | `DATABASE_URL`, pooled + a direct endpoint     |
| Identities and tokens | Firebase Authentication      | verified by Firebase Admin inside the API      |
| Photographed labels   | Firebase Cloud Storage       | uploaded by the app, read by URL from the API  |
| The model             | Anthropic, behind an API key | every call goes through the API, never the app |
| Crash reports         | Sentry, or nothing           | optional, absent by default                    |

So hosting Brewmate's API is: run one process, give it a handful of secrets,
let the platform terminate TLS, and point a probe at `/health`.

## Where to run it

**Recommendation: Render, from GitHub, on its own Node runtime.** No container
is built, nothing runs on a laptop, and `render.yaml` in the repository root
already describes the whole service - the build, the migration step, the health
check and every variable it reads. Deploying is connecting the repository once.

| Option               | Container needed | Fits because                                                             | Costs                                                    |
| -------------------- | ---------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Render**           | no               | `render.yaml` describes the service; pre-deploy hook runs the migrations | 7 USD/month (the free plan sleeps after 15 idle minutes) |
| **Railway**          | no               | Detects pnpm and Node itself; three commands to set, no blueprint needed | usage-based, similar for one small service               |
| **Fly.io**           | yes              | Explicit regions, built-in `release_command`                             | ~5-10 USD/month for one small machine                    |
| **Google Cloud Run** | yes              | Scales to zero honestly, cheapest at low traffic                         | per request; needs the pooled URL and a low pool max     |

What to avoid: anything that only runs a JavaScript bundle at the edge. The API
uses `pg` over TCP, Firebase Admin and a long-lived pool, and none of that is
what an edge runtime is for.

The database is on Neon, and every request makes at least one round trip to it,
so pick the region the Neon branch is in - a Neon project in `eu-central-1`
wants Frankfurt.

## Render, from nothing to a URL

1. **Neon**: create a production branch, separate from development and test.
   Copy both connection strings - the pooled one (hostname contains `-pooler`)
   and the direct one.
2. **Render → New → Blueprint**, pointed at this repository. It reads
   `render.yaml`: one web service called `brewmate-api`, Node runtime,
   Frankfurt, the build and start commands, `/health` as the health check.
3. **Fill in the secrets** it asks for - the seven marked `sync: false`. Two of
   them (`ANTHROPIC_API_KEY`, `SENTRY_DSN`) may be left empty; the API starts
   without them and says so at the two places it matters.
4. **Deploy.** The pre-deploy command runs the migrations before any traffic
   moves. Watch it in the log: `running database migrations` then
   `migrations complete`.
5. **Seed the catalogues, once.** From the service's shell, or locally with the
   production URL in the environment:

   ```bash
   node server/dist/db/seed/seedCli.js       # in Render's shell
   DATABASE_URL=<production pooled URL> pnpm --filter @brewmate/server db:seed
   ```

   It is idempotent, so running it again after a catalogue addition is how one
   ships. An empty `brew_methods` is an app where nothing can be brewed.

6. **Check it from outside**, not from the dashboard:

   ```bash
   curl https://brewmate-api.onrender.com/health   # {"status":"ok", ... "database":"up"}
   curl https://brewmate-api.onrender.com/me       # 401 in the shared error envelope
   ```

7. **Add the custom domain** `api.brewmate.app` and let Render issue the
   certificate, because `frontend/eas.json` points production builds at that
   hostname - or change the value there before building.

Three Render-specific things worth knowing, all three of them things that fail
loudly the first time. The build command overrides the package manager's linker
(`--config.node-linker=isolated`), because `.npmrc` hoists for Metro's sake and
hoisting ignores the `--filter` - without it Render installs React Native in
order to compile a Fastify server. `CI=true` is set as a variable because pnpm
will not purge a modules directory without a TTY unless it is told the run is
unattended. And there is no `corepack enable` in the build command: Render's
build image already has pnpm at `/usr/bin/pnpm` on a read-only filesystem, so
corepack fails with `EROFS: read-only file system, unlink '/usr/bin/pnpm'` -
`PNPM_VERSION` picks the version instead, and it has to be a 10, because the
lockfile is one and `engine-strict` refuses anything older.

## Railway, if Render's pricing stops fitting

No blueprint file; the same three commands go into the service settings, and
Railway detects Node and pnpm on its own:

```
Build:   pnpm install --frozen-lockfile --config.node-linker=isolated --filter @brewmate/server... && pnpm --filter @brewmate/shared build && pnpm --filter @brewmate/server build
Start:   node server/dist/index.js
```

Migrations have no pre-deploy hook there: run
`node server/dist/db/migrate/migrateCli.js` as a one-off command after a deploy
that carries a schema change, and set `CI=true` and `NIXPACKS_NODE_VERSION=22`
among the variables. Nixpacks reads the `packageManager` field for the pnpm
version, so there is nothing to pin by hand there.

## Environment

The server reads exactly what `server/src/config/envSchema.ts` lists and
nothing else. In production:

| Variable                                                                 | Required | Notes                                                                 |
| ------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------- |
| `NODE_ENV`                                                               | yes      | `production`                                                          |
| `PORT`                                                                   | platform | Injected by the host; the default is 3000                             |
| `HOST`                                                                   | no       | `0.0.0.0` already, which is what a hosted process needs               |
| `LOG_LEVEL`                                                              | no       | `info` in production; `debug` logs every request                      |
| `DATABASE_URL`                                                           | yes      | The **pooled** Neon endpoint (hostname contains `-pooler`)            |
| `DATABASE_URL_UNPOOLED`                                                  | yes      | The direct endpoint. Migrations need a plain session                  |
| `DATABASE_POOL_MAX`                                                      | no       | Default 10. See the arithmetic below before raising it                |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | yes      | Without them the process refuses to start                             |
| `ANTHROPIC_API_KEY`                                                      | no       | Absent is a working state: `/ai/*` answers 503, everything else works |
| `GOOGLE_VISION_API_KEY` / `GOOGLE_VISION_ENDPOINT`                       | no       | Both or neither. Absent means a label is read by the model alone      |
| `SENTRY_DSN`                                                             | no       | Absent means unexpected failures are logged and reported nowhere else |

`TEST_DATABASE_URL` has no place in a deployment. It is read only when
`NODE_ENV=test`, and the tests truncate every table.

**The optical reader is an aid, and it is allowed to be missing.** With
`GOOGLE_VISION_API_KEY` and `GOOGLE_VISION_ENDPOINT` set,
`POST /ai/parse-coffee-bag` transcribes the label before the model sees it -
which is what makes a roast date stamped in grey on a seam readable - and
refuses a photograph nothing legible came off before spending a model call on
it. Without them the photograph goes to the model unaccompanied and unchecked,
exactly as it did before. A reader that is configured but unreachable is the
same outcome as no reader: the scan goes through. The endpoint is a variable
rather than a constant because Google serves this API from several regional
hosts, and a deployment that must keep photographs inside one region is the
only party that can say which.

Vision calls are **not** metered in `ai_usage_logs` and not counted against the
per-account allowance: that ledger prices model tokens, and an annotation has
none. They are bounded elsewhere instead - one per scan, only after the image
hash misses the cache, and never for a photograph that has been read before.

**A variable left blank counts as absent.** Render creates every variable the
blueprint names, whether or not a value was typed into it, so an empty
`ANTHROPIC_API_KEY` has to mean "no model key" rather than "a key zero
characters long" - otherwise the two variables that are meant to be leavable
empty would be the two that stop the server from starting.

**The private key is the one that goes wrong.** It is a PEM with newlines in
it, environment variables cannot hold newlines, so it is stored with them
escaped (`\n`) and expanded by `normalizePrivateKey` on the way in. Paste it
exactly as it appears in the service account JSON. A key that arrives with real
newlines, or with the `\n` doubled, fails at start-up with
`Failed to parse private key` - which is the honest failure, because a server
that cannot verify a token can serve nobody.

## The database

Use a **separate Neon branch for production**, not the development one. The
branches are cheap, the development branch is where a half-finished migration
gets tried, and `db:seed` against the wrong branch is not something anybody
notices immediately.

- **Pooled for the API, direct for migrations.** The pooled endpoint is a
  connection pooler in front of Postgres and is what a process with its own pool
  should talk to; drizzle-kit and the migration runner need a plain session,
  which is what `DATABASE_URL_UNPOOLED` is for. `resolveDatabaseConfig` already
  picks the right one for each.
- **`DATABASE_POOL_MAX` × instances must stay under the branch's connection
  limit.** The default 10 is fine for one or two instances of a small plan.
  Doubling the instance count without halving the pool is how a deployment
  starts answering 500s that look like Neon being down.
- **Neon autosuspends an idle branch**, and the first request after that pays
  the wake-up. Harmless for a phone app in daily use; visible in a health check
  that runs every ten seconds and treats one slow answer as a dead process.

### Migrations are a release step

```bash
node server/dist/db/migrate/migrateCli.js
```

Not on boot. Two instances starting at once would run the same migration twice,
and a failed migration during a rolling deploy would take down the instances
that were serving perfectly well. Render has a pre-deploy command for exactly
this (`render.yaml` uses it), Fly has `release_command`, Railway has one-off
commands.

The compiled entry point rather than `pnpm db:migrate`, because `tsx` is a dev
dependency and a deployment that pruned its dev dependencies would not have it.

The order for a schema change is unchanged: edit `server/src/db/schema/`, run
`db:generate` locally, commit the generated SQL in `server/drizzle/`, and let
the release step apply it. Never hand-edit a migration that has already run
anywhere.

## In front of the process

- **TLS is the platform's.** iOS App Transport Security refuses plain HTTP, so
  a production build talking to `http://` is a build that cannot make a single
  request. `frontend/eas.json` sets `EXPO_PUBLIC_API_BASE_URL` to
  `https://api.brewmate.app` in the `base` profile - either point that hostname
  at the deployment, or change the value before building.
- **`/health` is the probe, and it answers 503 when the database is down.**
  That is the right answer for a load balancer and a slightly awkward one for a
  platform that restarts on a failed health check: a Neon branch that briefly
  cannot be reached will cost the instance a restart it did not need. Give the
  check a few seconds of timeout and several consecutive failures before acting.
- **No CORS plugin, on purpose.** The client is a phone app, and a browser
  preflight is not a thing that happens. Adding `@fastify/cors` is a decision to
  be made the day something in a browser talks to this API, with an explicit
  origin list rather than a wildcard.
- **The only rate limiting is the model allowance.** The per-account daily and
  monthly ceilings in front of `/ai/*` are what protect the invoice; there is no
  HTTP-level limiter. Everything else is authenticated and scoped to one
  account, so the exposure is a signed-in user hammering their own rows. If that
  becomes real, `@fastify/rate-limit` in `buildApp` is the place, not a rule
  copied into each route.
- **The body limit is 1 MB** and no photograph passes through the API - the app
  uploads to Cloud Storage and sends a URL.

## Logs

Pino writes JSON to stdout, which is what every platform above collects.
`redactPaths` already keeps authorization headers and cookies out, and the
error tracker deliberately sends only the route pattern, the request id and the
internal account id - never a path with an id in it, never a body. Set
`LOG_LEVEL=info`; `debug` logs every request and turns a month of logs into a
bill of its own.

## Deploying on every push, later

Render and Railway both deploy on a push to the tracked branch, which is the
right default for one contributor. The CI workflow already typechecks, lints
and runs the integration tests against the test branch on every push; the day
that matters more than speed, turn the automatic deploy off and let a workflow
step trigger it after the `verify` job, so a red build cannot ship.

## If a container is ever needed

`server/Dockerfile` builds the same process as an image, for Fly.io, Cloud Run,
or any other host that speaks only containers:

```bash
docker build -f server/Dockerfile -t brewmate-api .   # from the repository root
```

Nothing on the Render path uses it - it is not at the repository root, so no
platform picks it up by accident - and it exists so that moving hosts later is
a decision rather than a rewrite. The context is the repository root because
the API imports `@brewmate/shared` and a context that cannot see the workspace
cannot compile it; the install is filtered and the linker overridden for the
same reason the Render build command does both; and the runtime stage installs
again rather than copying the builder's tree, because TypeScript, drizzle-kit
and vitest have no business facing the internet.

## What this does not include

Said plainly, so nobody goes looking for it:

- **No staging environment.** One production deployment plus a laptop pointing
  at the development branch. A staging API is worth adding the day somebody
  other than the author is testing releases.
- **No backups beyond Neon's.** Neon keeps point-in-time restore on its own
  schedule; that is the whole backup story, and it is worth checking which
  retention the plan includes before it is needed.
- **No background jobs, no queue, no cron.** Nothing in the product runs
  without a request behind it, which is why one process is enough.
