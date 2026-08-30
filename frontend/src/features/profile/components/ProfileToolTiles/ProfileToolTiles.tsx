import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { PROFILE_TILE_ICONS } from '../../constants';

/**
 * The two screens that are about the account rather than about a coffee.
 *
 * Tiles rather than two buttons stacked in a card, and the same tiles the home
 * screen is built from: both of these are destinations, and a button inside a
 * card whose heading was borrowed from the screen it leads to was the least
 * legible thing on this page.
 *
 * They live behind the profile because both are read occasionally and
 * deliberately, not on the way to making a cup.
 */
export const ProfileToolTiles = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TileRow>
      <Tile
        icon={PROFILE_TILE_ICONS.insights}
        tone="accent"
        title={t(TRANSLATION_KEYS.profileTileInsightsTitle)}
        caption={t(TRANSLATION_KEYS.profileTileInsightsCaption)}
        onPress={(): void => {
          router.push(ROUTES.insights);
        }}
      />
      <Tile
        icon={PROFILE_TILE_ICONS.costs}
        title={t(TRANSLATION_KEYS.profileTileCostsTitle)}
        caption={t(TRANSLATION_KEYS.profileTileCostsCaption)}
        onPress={(): void => {
          router.push(ROUTES.aiCosts);
        }}
      />
    </TileRow>
  );
};
