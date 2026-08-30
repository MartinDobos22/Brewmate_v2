import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { HOME_TILE_ICONS } from '../../constants';

/** The brewing screen, for a cup made from what is actually in the cupboard. */
export const BrewTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Tile
      icon={HOME_TILE_ICONS.brew}
      title={t(TRANSLATION_KEYS.homeTileBrewTitle)}
      caption={t(TRANSLATION_KEYS.homeTileBrewCaption)}
      onPress={(): void => {
        router.push(ROUTES.brew);
      }}
    />
  );
};
