import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { HOME_TILE_ICONS } from '../../constants';

/**
 * Brewing without writing anything down first.
 *
 * Beside the full brewing screen rather than inside it, because the two answer
 * different questions: this one is "make me coffee now", and nobody wants to
 * fill in a database before they are allowed to.
 */
export const QuickBrewTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Tile
      icon={HOME_TILE_ICONS.quickBrew}
      tone="accent"
      title={t(TRANSLATION_KEYS.homeTileQuickBrewTitle)}
      caption={t(TRANSLATION_KEYS.homeTileQuickBrewCaption)}
      onPress={(): void => {
        router.push(ROUTES.quickBrew);
      }}
    />
  );
};
