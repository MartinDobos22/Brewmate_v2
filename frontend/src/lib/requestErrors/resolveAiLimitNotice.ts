import { AI_LIMIT_KINDS, AI_USAGE_WINDOWS, aiRateLimitDetailsSchema } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../i18n';
import { ApiClientError } from '../apiClient';
import { formatDateTime } from '../formatters';
import type { InterpolationValues } from '../text';

export interface AiLimitNotice {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
  readonly bodyValues: InterpolationValues;
}

/**
 * The sentence for an account that has used up its model allowance.
 *
 * Written from the details the API sends rather than from the status code
 * alone, because "príliš veľa pokusov" is an accusation and this is not one:
 * nothing broke, the person did nothing wrong, they used a thing up and it
 * comes back at a stated moment. The sentence names that moment, in their own
 * timezone, and says what still works in the meantime.
 *
 * @returns null for every other failure, which the ordinary mapping handles.
 */
export const resolveAiLimitNotice = (error: unknown): AiLimitNotice | null => {
  if (!(error instanceof ApiClientError)) {
    return null;
  }

  const details = aiRateLimitDetailsSchema.safeParse(error.details);

  if (!details.success) {
    return null;
  }

  return {
    titleKey:
      details.data.window === AI_USAGE_WINDOWS.month
        ? TRANSLATION_KEYS.errorAiLimitMonthTitle
        : TRANSLATION_KEYS.errorAiLimitTitle,
    bodyKey:
      details.data.limit === AI_LIMIT_KINDS.calls
        ? TRANSLATION_KEYS.errorAiLimitCallsBody
        : TRANSLATION_KEYS.errorAiLimitCostBody,
    bodyValues: { time: formatDateTime(details.data.resetsAt) },
  };
};
