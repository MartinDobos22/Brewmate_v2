import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useBagScan } from '../../hooks/useBagScan';

import { ScanStageContent } from './ScanStageContent';

/**
 * "Mám si ju kúpiť?", asked in front of a shelf.
 *
 * The one thing a brand-new account can do that pays off the same afternoon:
 * it needs no cupboard and no brewing history, only the questionnaire - and
 * when even that is missing it says so instead of guessing. That is why it
 * sits on the home screen rather than three taps inside the inventory.
 */
export const ScanBagScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const scan = useBagScan();

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.scanTitle)}</Text>
      <ScanStageContent scan={scan} />
    </Screen>
  );
};
