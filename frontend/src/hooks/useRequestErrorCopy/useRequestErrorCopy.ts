import { useTranslation } from '../../i18n';
import { resolveRequestErrorKeys } from '../../lib/requestErrors';
import { useIsOnline } from '../useIsOnline';

export interface RequestErrorCopy {
  readonly title: string;
  readonly description: string;
}

/**
 * A failed request, as a sentence somebody can read.
 *
 * The only place a screen learns what a failure says, so no component ever
 * has to decide what `SERVICE_UNAVAILABLE` looks like in Slovak - or worse,
 * print it.
 */
export const useRequestErrorCopy = (error: unknown): RequestErrorCopy => {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const { titleKey, bodyKey, bodyValues } = resolveRequestErrorKeys(error, isOnline);

  return { title: t(titleKey), description: t(bodyKey, bodyValues) };
};
