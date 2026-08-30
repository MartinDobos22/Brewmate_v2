import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { Text, Tile } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SectionBlock } from '../SectionBlock';

const DEMO_ICON = 'coffee-outline';
const DEMO_REPORT_ICON = 'chart-bar';
const noop = (): void => undefined;

/**
 * The three tile tones, in the two arrangements the grid actually uses.
 *
 * A tile is only correct next to another tile - a row has to share its width
 * evenly and match its neighbour's height whatever either of them holds - so
 * the preview is rows rather than one specimen.
 */
export const TilesSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionTiles)}>
      <TileRow>
        <Tile
          icon={DEMO_ICON}
          tone="primary"
          title={t(TRANSLATION_KEYS.dsTilePrimaryTitle)}
          caption={t(TRANSLATION_KEYS.dsTilePrimaryCaption)}
          onPress={noop}
        />
      </TileRow>
      <TileRow>
        <Tile
          icon={DEMO_ICON}
          tone="accent"
          title={t(TRANSLATION_KEYS.dsTileAccentTitle)}
          caption={t(TRANSLATION_KEYS.dsTileAccentCaption)}
          onPress={noop}
        />
        <Tile
          icon={DEMO_REPORT_ICON}
          title={t(TRANSLATION_KEYS.dsTileNeutralTitle)}
          caption={t(TRANSLATION_KEYS.dsTileNeutralCaption)}
        >
          <Text variant="numericLarge" numeric>
            {t(TRANSLATION_KEYS.dsTileNeutralValue)}
          </Text>
        </Tile>
      </TileRow>
    </SectionBlock>
  );
};
