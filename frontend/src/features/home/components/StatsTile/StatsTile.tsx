import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Text, Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDecimal } from '../../../../lib/formatters';
import { HOME_TILE_ICONS } from '../../constants';
import { useBrewStats } from '../../hooks';

import { BrewSparkline } from './BrewSparkline';

const NOTHING = 0;

/**
 * A week of brewing, and nothing more than a week.
 *
 * Deliberately not a lifetime total. One page of logs cannot honestly say how
 * many cups an account has ever made, and the profile's own brew count means
 * something else again - it counts the cups that were described rather than
 * the cups that were brewed. A number on a tile that needs a paragraph beside
 * it is a number that will be misread, so this one says what it counts.
 */
export const StatsTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const stats = useBrewStats();

  return (
    <Tile
      icon={HOME_TILE_ICONS.stats}
      title={t(TRANSLATION_KEYS.homeTileStatsTitle)}
      caption={t(
        stats.total === NOTHING
          ? TRANSLATION_KEYS.homeTileStatsNone
          : TRANSLATION_KEYS.homeTileStatsCaption,
      )}
      onPress={(): void => {
        router.push(ROUTES.insights);
      }}
    >
      <Text
        variant="numericLarge"
        numeric
        accessibilityLabel={t(TRANSLATION_KEYS.homeTileStatsTotalLabel)}
      >
        {formatDecimal(stats.total)}
      </Text>
      <BrewSparkline days={stats.days} />
    </Tile>
  );
};
