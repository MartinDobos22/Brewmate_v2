import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Dial, Text } from '../../../../components/ui';
import { BAG_FRESHNESS_DAYS } from '../../../../constants/brewing';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme } from '../../../../theme';
import { BAG_FRESHNESS_DIAL_COLORS } from '../../constants';
import { resolveBagFreshness } from '../../services/resolveBagFreshness';

const NONE = 0;

export interface BagFreshnessDialProps {
  readonly bag: CoffeeBag;
}

/**
 * How far through its window this bag is, drawn rather than described.
 *
 * The ring fills against one horizon - the end of the window where a coffee is
 * at its best - rather than against whichever band the bag happens to be in.
 * A per-band ring would reset its meaning four times: three days into a rest
 * would draw a nearly full circle and read as "almost gone" when it means
 * "almost ready". One horizon makes it monotonic, so the ring only ever says
 * how much of this coffee's life has passed, and the colour says whether that
 * is good news.
 *
 * Past the window it is simply full, which is the honest end of that sentence.
 * A bag with no roast date gets a track, a question mark and no arc: nobody
 * knowing how old a coffee is and a coffee roasted today are different facts,
 * and only one of them is a number.
 */
export const BagFreshnessDial = ({ bag }: BagFreshnessDialProps): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { freshness, days } = resolveBagFreshness(bag);

  return (
    <Dial
      progress={days === null ? NONE : days / BAG_FRESHNESS_DAYS.idealUntil}
      size={theme.size.dialLarge}
      strokeWidth={theme.size.dialLargeStroke}
      color={theme.colors[BAG_FRESHNESS_DIAL_COLORS[freshness]]}
      trackColor={theme.colors.surfaceDim}
      accessibilityLabel={t(TRANSLATION_KEYS.inventoryDialLabel)}
    >
      <Text variant="numericDial" numeric>
        {days === null ? t(TRANSLATION_KEYS.inventoryDialUnknown) : String(days)}
      </Text>
      <Text variant="microLabel" tone="muted">
        {t(TRANSLATION_KEYS.unitDays)}
      </Text>
    </Dial>
  );
};
