import { ANALYTICS_EVENT_NAMES } from '@brewmate/shared';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { trackEvent } from '../../../lib/analytics';
import { fetchAccountExport } from '../services/accountExportApi';
import { saveAccountExport } from '../services/saveAccountExport';

/**
 * Fetches the account and hands it to the share sheet.
 *
 * A mutation rather than a query, because nothing about it should happen on
 * its own: this reads every row an account owns and writes a file, and doing
 * that because somebody opened a screen would be the wrong shape entirely.
 * Nothing is cached either - a copy of somebody's whole account sitting in the
 * query cache is a copy nobody asked us to keep.
 *
 * @returns true when the sheet opened, false where the platform has none.
 */
export const useExportAccount = (): UseMutationResult<boolean, Error, void> => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (): Promise<boolean> =>
      saveAccountExport(await fetchAccountExport(), {
        fileName: t(TRANSLATION_KEYS.privacyExportFileName),
        dialogTitle: t(TRANSLATION_KEYS.privacyExportShareTitle),
      }),
    /**
     * Counted, and counted without anything about what was in the file. How
     * often people exercise this right is worth knowing; what they exported is
     * the whole of what the right is about.
     */
    onSuccess: (): void => {
      trackEvent(ANALYTICS_EVENT_NAMES.accountExported);
    },
  });
};
