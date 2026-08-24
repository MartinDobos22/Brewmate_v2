import { DEFAULT_LOCALE } from '../../i18n/locales';

/**
 * A moment, in the reader's own timezone.
 *
 * The API states every deadline as an instant in UTC precisely so this can
 * happen: "obnoví sa o 01:00" is an answer somebody can act on, and it is only
 * true if the phone converts it rather than repeating the server's clock. The
 * day is included because a monthly window resets weeks away, and "o 01:00"
 * on its own would read as tonight.
 */
export const formatDateTime = (isoTimestamp: string): string =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(isoTimestamp));
