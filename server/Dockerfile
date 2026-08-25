# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# The Brewmate API as one container image.
#
# Built from the repository root, because the API depends on @brewmate/shared
# and a build context that cannot see the workspace cannot compile it:
#
#   docker build -f server/Dockerfile -t brewmate-api .
#
# Everything the process needs beyond this image is hosted somewhere else - the
# database on Neon, the identities in Firebase, the model behind an API key -
# so the image holds no state, writes nothing to disk and can be replaced by
# the next one at any moment.
# ---------------------------------------------------------------------------

FROM node:22.19.0-alpine AS builder

# pnpm refuses to purge a modules directory without a TTY unless it is told it
# is running unattended, which a build is.
ENV CI=true
RUN corepack enable
WORKDIR /app

# The manifests alone, so a change to the source does not reinstall the world.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY frontend/package.json ./frontend/

# `--filter @brewmate/server...` installs the API and the contract it depends
# on, and nothing else. The linker is overridden because this repository hoists
# for Metro's sake (see .npmrc) and hoisting ignores the filter - it would pull
# React Native and the whole Expo toolchain into an image that never runs them.
RUN pnpm install --frozen-lockfile --config.node-linker=isolated --filter @brewmate/server...

COPY shared ./shared
COPY server ./server

# The contract first: the API's emit resolves it through node_modules, as the
# built package rather than through the source alias.
RUN pnpm --filter @brewmate/shared run build \
  && pnpm --filter @brewmate/server run build

# ---------------------------------------------------------------------------

FROM node:22.19.0-alpine AS runtime

ENV CI=true
ENV NODE_ENV=production
RUN corepack enable
WORKDIR /app

# A second install rather than a copy of the first one: the build needs
# TypeScript, drizzle-kit and vitest, and none of them belong in something
# facing the internet.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile --prod --config.node-linker=isolated --filter @brewmate/server...

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/dist ./server/dist

# The generated SQL, read at run time by `node dist/db/migrate/migrateCli.js`.
# Migrations are a release step rather than something the server does on boot -
# see docs/release/backend-hosting.md.
COPY server/drizzle ./server/drizzle

USER node
WORKDIR /app/server

# Overridable through PORT, like everything else the server reads.
EXPOSE 3000

CMD ["node", "dist/index.js"]
