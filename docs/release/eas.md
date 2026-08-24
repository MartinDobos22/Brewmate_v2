# Building and updating with EAS

## What is configured, and what is not

`frontend/eas.json` holds three build profiles and a submit profile.
`frontend/app.config.ts` layers the environment-dependent parts on top of
`app.json`: the EAS project id, the owner and the release name.

Those three are **not** in the repository on purpose. A project id belongs to
whoever owns the app rather than to the source, and a placeholder one would
fail at build time with a message about somebody else's account. Without them
`expo start` runs exactly as before and over-the-air updates are simply not
configured - which is the right behaviour for a checkout that has never been
connected to EAS.

```bash
export EAS_PROJECT_ID=...   # eas init prints it
export EAS_OWNER=...        # the Expo account or organisation
```

## Profiles

| Profile       | Channel       | For                                                                                    |
| ------------- | ------------- | -------------------------------------------------------------------------------------- |
| `development` | `development` | A dev client against a laptop's API. iOS simulator build, Android APK.                 |
| `preview`     | `preview`     | Internal distribution of a release-like build. APK on Android so it can be sideloaded. |
| `production`  | `production`  | Store builds. `autoIncrement` moves the build number so a resubmission never collides. |

`appVersionSource` is `remote`: EAS owns the build number, which is the only
way it can be incremented reliably by a machine rather than by whoever
remembered.

## Building

```bash
cd frontend
pnpm dlx eas-cli build --profile production --platform all
pnpm dlx eas-cli submit --profile production --platform ios
```

Fill `ascAppId` and `appleTeamId` in `eas.json` before the first submit; both
are placeholders in the repository for the same reason the project id is.

## Updating

```bash
pnpm dlx eas-cli update --channel production --message "Fix the ratio label"
```

**What may be shipped this way, and what may not.** An update carries the
JavaScript bundle and the assets. It cannot change native code, and
`runtimeVersion` is tied to `appVersion` precisely so it cannot try: a build
only accepts updates published against its own version. So anything that adds
or upgrades a native module - a new Expo package, a config plugin, an SDK bump

- needs a version bump and a store build, and shipping it as an update would
  be the one real failure mode of this mechanism.

The app waits one second for a newer bundle before starting with the one it
has. That second is time somebody spends looking at the splash screen; an
update that is not ready by then can be ready for the next launch instead.

## Environment in a build

`eas.json` sets `EXPO_PUBLIC_API_BASE_URL` per profile. Everything else public
(the Firebase client configuration, the Google client IDs, the storage bucket,
the Sentry DSN and the release name) belongs in EAS environment variables
rather than in this file, because the file is committed. None of them are
secrets - they identify rather than authorise - but a repository is still the
wrong place to write down which Firebase project a build points at.

Nothing that _is_ a secret can reach a build: `ANTHROPIC_API_KEY`, the database
URLs and the Firebase Admin credentials live in `server/.env` and never in the
bundle, which is the whole reason every model call goes through the API.
