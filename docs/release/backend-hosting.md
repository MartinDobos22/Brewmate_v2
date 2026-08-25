# Hosting the API

## What actually has to be hosted

One stateless Node process. Everything with state in it is already somebody
else's problem:

| Piece                 | Where it lives               | Already true today                             |
| --------------------- | ---------------------------- | ---------------------------------------------- |
| The database          | Neon                         | `DATABASE_URL`, pooled + a direct endpoint     |
| Identities and tokens | Firebase Authentication      | verified by Firebase Admin inside the API      |
| Photographed labels   | Firebase Cloud Storage       | uploaded by the app, read by URL from the API  |
| The model             | Anthropic, behind an API key | every call goes through the API, never the app |
| Crash reports         | Sentry, or nothing           | optional, absent by default                    |

So the API keeps nothing on disk, holds no session and can be replaced by the
next container mid-morning. That is the whole hosting requirement: run one
process, give it environment variables, put TLS in front of it, and point a
health probe at `/health`.

`server/Dockerfile` builds that process. Anything that can run a container can
run Brewmate's API - the choice below is about where the database is and how
much of a platform somebody wants to operate, not about what the API needs.

## Where to run it

**Recommendation: Fly.io, in the region the Neon branch is in.** Every request
this API serves makes at least one database round trip and the model calls make
several, so the distance between the process and Neon is the one latency figure
worth choosing deliberately. A Neon project in `eu-central-1` wants `fra`.

| Option               | Fits because                                                                            | Costs                                                            |
| -------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Fly.io**           | Dockerfile deploys as-is, regions are explicit, secrets and a release step are built in | ~5-10 USD/month for one small always-on machine                  |
| **Railway**          | Least to set up; reads the Dockerfile, one screen of variables                          | usage-based, similar for a single service                        |
| **Render**           | Same shape, has a managed cron for the release step                                     | free tier sleeps - a cold start on the first brew of the morning |
| **Google Cloud Run** | Scales to zero honestly and is the cheapest at low traffic                              | pay-per-request; needs the pooled Neon URL and a low pool max    |

What to avoid: anything that only runs a JavaScript bundle at the edge. The API
uses `pg` over TCP, Firebase Admin and a long-lived pool, and none of that is
what an edge runtime is for.

## The image

```bash
docker build -f server/Dockerfile -t brewmate-api .
docker run --rm -p 3000:3000 --env-file server/.env brewmate-api
```

Three decisions in it are worth knowing before changing them:

- **The build context is the repository root**, because the API imports
  `@brewmate/shared` and a context that cannot see the workspace cannot compile
  it. The contract is built first, then the API, and the API's emit resolves it
  through `node_modules` as the built package.
- **The install is filtered and the linker is overridden.**
  `--filter @brewmate/server...` takes the API and the contract and leaves the
  app out; `--config.node-linker=isolated` is needed because `.npmrc` hoists for
  Metro's sake and hoisting ignores the filter - without it React Native and the
  whole Expo toolchain end up in an image that never runs them (about 700 MB
  against about 130 MB).
- **The runtime stage installs again rather than copying the builder's tree.**
  TypeScript, drizzle-kit and vitest are needed to produce the build and have no
  business facing the internet.

`tsx` is a dev dependency, so the `pnpm db:*` scripts do not exist in the image.
The compiled entry points do: `node dist/db/migrate/migrateCli.js` and
`node dist/db/seed/seedCli.js`, both run from `/app/server`.

## Environment

The server reads exactly what `server/src/config/envSchema.ts` lists and
nothing else. In production:

| Variable                                                                 | Required | Notes                                                                 |
| ------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------- |
| `NODE_ENV`                                                               | yes      | `production`. Set in the image already                                |
| `PORT`                                                                   | platform | Most platforms inject it; the default is 3000                         |
| `HOST`                                                                   | no       | `0.0.0.0` already, which is what a container needs                    |
| `LOG_LEVEL`                                                              | no       | `info` in production; `debug` prints every request                    |
| `DATABASE_URL`                                                           | yes      | The **pooled** Neon endpoint (hostname contains `-pooler`)            |
| `DATABASE_URL_UNPOOLED`                                                  | yes      | The direct endpoint. Migrations need a plain session                  |
| `DATABASE_POOL_MAX`                                                      | no       | Default 10. See the arithmetic below before raising it                |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | yes      | Without them the process refuses to start                             |
| `ANTHROPIC_API_KEY`                                                      | no       | Absent is a working state: `/ai/*` answers 503, everything else works |
| `SENTRY_DSN`                                                             | no       | Absent means unexpected failures are logged and reported nowhere else |

`TEST_DATABASE_URL` has no place in a deployment. It is read only when
`NODE_ENV=test`, and the tests truncate every table.

**The private key is the one that goes wrong.** It is a PEM with newlines in it,
and environment variables cannot hold newlines, so it is stored with them
escaped (`\n`) and expanded by `normalizePrivateKey` on the way in. Paste it
exactly as it appears in the service account JSON, including the surrounding
quotes if the platform's UI keeps them. A key that arrives with real newlines,
or with the `\n` doubled, fails at start-up with
`Failed to parse private key` - which is the honest failure, because a server
that cannot verify a token can serve nobody.

Set every one of them as a platform secret. None of them belong in the
repository, and only the app's `EXPO_PUBLIC_*` values ever may.

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
# in the image, from /app/server
node dist/db/migrate/migrateCli.js
```

Not on boot. Two instances starting at once would run the same migration twice,
and a failed migration during a rolling deploy would take down the instances
that were serving perfectly well. Every platform above has a place for this:
Fly's `release_command`, Render's pre-deploy command, a Railway one-off.

The order for a schema change is unchanged: edit `server/src/db/schema/`, run
`db:generate` locally, commit the generated SQL in `server/drizzle/`, and let
the release step apply it. Never hand-edit a migration that has already run
anywhere.

### Seeding

`node dist/db/seed/seedCli.js`, once per environment. It is idempotent -
methods are matched on `key`, grinders on brand and model - so running it again
after a catalogue addition is the intended way to ship one. An empty
`brew_methods` table is an app where nothing can be brewed, so this is not
optional on a fresh branch.

## In front of the process

- **TLS is the platform's.** iOS App Transport Security refuses plain HTTP, so
  a production build talking to `http://` is a build that cannot make a single
  request. `frontend/eas.json` sets `EXPO_PUBLIC_API_BASE_URL` to
  `https://api.brewmate.app` in the `base` profile - either point that hostname
  at the deployment, or change the value before building.
- **`/health` is the probe.** It pings the database and answers 503 when that
  fails, which is the right answer for a load balancer and the wrong one for an
  aggressive restart policy: a Neon branch waking up is not a broken process.
  Give the check a few seconds of timeout and require several consecutive
  failures before replacing anything.
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
  uploads to Cloud Storage and sends a URL. A platform that adds its own body
  limit is not a problem for this API.

## Logs

Pino writes JSON to stdout, which is what every platform above collects.
`redactPaths` already keeps authorization headers and cookies out, and the
error tracker deliberately sends only the route pattern, the request id and the
internal account id - never a path with an id in it, never a body. Set
`LOG_LEVEL=info`; `debug` logs every request and turns a month of logs into a
bill of its own.

## Deploying

Manually, at first, because a deploy that somebody watches is worth more than
one that happens on every merge to a repository with one contributor:

```bash
fly deploy --dockerfile server/Dockerfile        # release_command runs the migration
```

The CI workflow already typechecks, lints and runs the integration tests
against the test branch on every push. When a deploy step is added, it belongs
_after_ that job and behind `github.ref == 'refs/heads/main'`, with the platform
token as a repository secret - not as a step that can ship a red build.

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
