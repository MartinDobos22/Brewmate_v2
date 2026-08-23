import type { JSX } from 'react';

import { EmptyState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_SCAN_MODES } from '../../constants/bagScan';
import type { BagScan } from '../../hooks/useBagScan';

/**
 * The end of one scan, and the way into the next.
 *
 * Three different endings rather than one, because they are three different
 * facts: a coffee added to the cupboard, a coffee bought on the app's advice,
 * and a coffee left on the shelf. Telling somebody "zapísané" after they put a
 * bag back would be the app not listening.
 */
export const ScanDoneStep = ({ scan }: { readonly scan: BagScan }): JSX.Element => {
  const { t } = useTranslation();

  if (scan.mode === BAG_SCAN_MODES.inventory) {
    return (
      <EmptyState
        title={t(TRANSLATION_KEYS.scanAddedTitle)}
        description={t(TRANSLATION_KEYS.scanAddedBody)}
        actions={[
          { label: t(TRANSLATION_KEYS.scanAgain), variant: 'primary', onPress: scan.reset },
        ]}
      />
    );
  }

  return (
    <EmptyState
      title={t(
        scan.outcome.wasPurchased
          ? TRANSLATION_KEYS.scanSavedTitle
          : TRANSLATION_KEYS.scanSkippedTitle,
      )}
      description={t(
        scan.outcome.wasPurchased
          ? TRANSLATION_KEYS.scanSavedBody
          : TRANSLATION_KEYS.scanSkippedBody,
      )}
      actions={[{ label: t(TRANSLATION_KEYS.scanAgain), variant: 'primary', onPress: scan.reset }]}
    />
  );
};
