import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useBrewStats } from '../../hooks';

import { BrewHistoryPreview } from './BrewHistoryPreview';

/**
 * What the brewing history will be, for an account that has none.
 *
 * The one card left on a screen otherwise made of tiles, and deliberately so:
 * it is the only thing here that has to be read rather than tapped. Three
 * lines of what will appear after the first brew, and one sentence about why
 * the trouble is worth taking - because "opíš mi kávu" is a favour the user
 * does the app, and a favour deserves a reason.
 *
 * Once there is a cup behind it the card leaves for good. The tiles above
 * report the history from then on, and a second card repeating them would be
 * the empty-frame dashboard this screen exists to avoid.
 */
export const BrewHistoryCard = (): JSX.Element | null => {
  const { t } = useTranslation();
  const brews = useBrewStats();

  if (!brews.isReady || brews.hasBrewed) {
    return null;
  }

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.brewHistoryEmptyTitle)}</Text>
      <BrewHistoryPreview />
    </Card>
  );
};
