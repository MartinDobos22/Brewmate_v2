import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Text, Tile } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { HOME_TILE_ICONS } from '../../constants';

/**
 * The shop scanner, and the one tile on this screen painted in the primary
 * tone.
 *
 * It is the only feature a brand-new account can use in the first minute and
 * get something real back from - no cupboard, no history, only the
 * questionnaire - so it spans the grid rather than sharing a row. Burying it
 * three taps inside the inventory would be hiding the one door already open.
 */
export const ScanTile = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Tile
      icon={HOME_TILE_ICONS.scan}
      tone="primary"
      title={t(TRANSLATION_KEYS.homeTileScanTitle)}
      onPress={(): void => {
        router.push(ROUTES.scan);
      }}
    >
      <Text variant="bodySmall">{t(TRANSLATION_KEYS.homeScanBody)}</Text>
    </Tile>
  );
};
