import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Typed locally, the same way the app's own environment reader is: this file
 * runs in Node at build time, but the package it belongs to has no Node type
 * definitions and adding them would put `process` in reach of the bundle.
 */
declare const process: { readonly env: Readonly<Record<string, string | undefined>> };

/**
 * The parts of the Expo configuration that depend on the environment.
 *
 * `app.json` still holds everything static - the icons, the permission
 * strings, the privacy manifest - and this file layers on top of it the two
 * things a checked-in JSON file cannot honestly carry: the EAS project id,
 * which belongs to whoever owns the app rather than to the repository, and the
 * release name, which is different for every build.
 *
 * Both are optional. Without them `expo start` runs exactly as before and
 * over-the-air updates are simply not configured - which is the correct
 * behaviour for a checkout that has never been connected to an EAS project,
 * and better than a placeholder id that would fail at build time with a
 * message about somebody else's account.
 */
const EAS_PROJECT_ID = 'EAS_PROJECT_ID';
const EAS_OWNER = 'EAS_OWNER';
const RELEASE = 'EXPO_PUBLIC_RELEASE';
const UPDATE_HOST = 'https://u.expo.dev/';

/**
 * How long the app waits for a newer bundle before starting with the one it
 * has. Short, because this is time somebody spends looking at the splash
 * screen: an update that is not ready in a second is one that can be ready for
 * the next launch instead.
 */
const UPDATE_FALLBACK_TIMEOUT_MS = 1000;

/**
 * Which builds an update may be delivered to.
 *
 * Tied to the app version rather than to a hand-maintained number, because
 * that is the honest reading of what a JavaScript bundle is compatible with:
 * every native change in this project arrives with a version bump, and an
 * update pushed to a build whose native modules it does not match is the one
 * failure mode of this whole mechanism.
 */
const RUNTIME_VERSION_POLICY = 'appVersion';

/**
 * Reads one variable, treating an empty one as absent - the same rule the app's
 * own configuration reader applies.
 *
 * `.env.example` lists every optional variable with nothing after the `=`, and
 * an empty `EXPO_PUBLIC_RELEASE` used to become the app's `version`. With
 * `runtimeVersion` following `appVersion`, that leaves the version empty and a
 * development build refuses to open the bundle at all: "Unable to determine
 * runtime version for platform 'android'".
 */
const readEnvironmentVariable = (key: string): string | undefined => {
  const value = process.env[key];

  return value === undefined || value === '' ? undefined : value;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId = readEnvironmentVariable(EAS_PROJECT_ID);

  return {
    ...config,
    name: config.name ?? '',
    slug: config.slug ?? '',
    owner: readEnvironmentVariable(EAS_OWNER) ?? config.owner,
    runtimeVersion: { policy: RUNTIME_VERSION_POLICY },
    ...(projectId === undefined
      ? {}
      : {
          updates: {
            url: `${UPDATE_HOST}${projectId}`,
            fallbackToCacheTimeout: UPDATE_FALLBACK_TIMEOUT_MS,
          },
          extra: { ...config.extra, eas: { projectId } },
        }),
    /**
     * Stamped into every crash report, so "did the fix work?" has an answer.
     * Without it every report from every version is one undifferentiated pile.
     */
    version: readEnvironmentVariable(RELEASE) ?? config.version,
  };
};
