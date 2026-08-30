import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { Tile } from '../../../../components/ui';
import { APP_CONFIG } from '../../../../constants/config';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { PROFILE_TILE_ICONS } from '../../constants';

/**
 * The way into the design system screen, in a development build only.
 *
 * It brings its own row and hides itself, so the screen above carries no
 * `designSystemScreenEnabled` branch of its own - the one place that flag is
 * read for this route is here, next to the route it guards.
 */
export const DeveloperTile = (): JSX.Element | null => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!APP_CONFIG.designSystemScreenEnabled) {
    return null;
  }

  return (
    <TileRow>
      <Tile
        icon={PROFILE_TILE_ICONS.designSystem}
        title={t(TRANSLATION_KEYS.profileTileDesignSystemTitle)}
        caption={t(TRANSLATION_KEYS.profileTileDesignSystemCaption)}
        onPress={(): void => {
          router.push(ROUTES.designSystem);
        }}
      />
    </TileRow>
  );
};
