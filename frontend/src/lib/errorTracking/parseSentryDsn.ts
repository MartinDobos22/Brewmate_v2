import { EMPTY, PATH_SEPARATOR } from './constants/sentryProtocol';

/**
 * The three things an envelope needs, taken out of a DSN.
 *
 * A DSN is `https://<key>@<host>/<projectId>`: the key identifies the project
 * to report to, the host receives, and the project id is the last path
 * segment. Parsed rather than asked for as three variables because a DSN is
 * what the provider hands somebody to copy, and three fields to fill in from
 * one string is three chances to get a build wrong.
 */
export interface SentryDsn {
  readonly endpoint: string;
  readonly publicKey: string;
  readonly projectId: string;
}

/**
 * @returns the parsed DSN, or null when the string is not one.
 *
 * Null rather than a throw: a malformed DSN must not be able to stop an app
 * that is otherwise ready to make coffee. It means crashes are reported
 * nowhere, and everything else works.
 */
export const parseSentryDsn = (dsn: string): SentryDsn | null => {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.split(PATH_SEPARATOR).filter(Boolean).at(-1) ?? EMPTY;

    if (url.username === EMPTY || projectId === EMPTY) {
      return null;
    }

    return { endpoint: url.origin, publicKey: url.username, projectId };
  } catch {
    return null;
  }
};
