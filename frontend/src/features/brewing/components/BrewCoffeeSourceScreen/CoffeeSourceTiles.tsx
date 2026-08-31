import type { JSX } from 'react';
import { View } from 'react-native';

import { TileRow } from '../../../../components/layout';
import { Button, Text, Tile } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { COFFEE_SOURCE_ICONS } from '../../constants';

import { createBrewCoffeeSourceStyles } from './BrewCoffeeSourceScreen.styles';

export interface CoffeeSourceTilesProps {
  /** False in a build with no storage bucket, where there is no camera to open. */
  readonly canPhotograph: boolean;
  readonly onPhotograph: () => void;
  readonly onInventory: () => void;
  readonly onUnrecorded: () => void;
}

/**
 * The two ways a coffee gets into a brew, at the same size, side by side.
 *
 * Same weight on purpose. Photographing a bag is not the fallback for an empty
 * cupboard and the cupboard is not the fallback for a bad camera - they are
 * two ordinary situations, and whichever one somebody is in, the other one
 * being louder would be the screen guessing wrong about them. As a list with
 * the cupboard on top, a bag that was not written down read as an omission to
 * be fixed before anybody was allowed to make coffee.
 *
 * "Nemám ju zapísanú" is underneath and quieter, because it is neither: it is
 * the answer for somebody who is not going to write this coffee down at all,
 * and a recipe still gets written for them.
 */
export const CoffeeSourceTiles = ({
  canPhotograph,
  onPhotograph,
  onInventory,
  onUnrecorded,
}: CoffeeSourceTilesProps): JSX.Element => {
  const styles = useThemedStyles(createBrewCoffeeSourceStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.choices}>
      <TileRow>
        {canPhotograph ? (
          <Tile
            icon={COFFEE_SOURCE_ICONS.photo}
            tone="primary"
            title={t(TRANSLATION_KEYS.preBrewSourcePhoto)}
            caption={t(TRANSLATION_KEYS.preBrewSourcePhotoCaption)}
            onPress={onPhotograph}
          />
        ) : null}
        <Tile
          icon={COFFEE_SOURCE_ICONS.inventory}
          tone="accent"
          title={t(TRANSLATION_KEYS.preBrewSourceInventory)}
          caption={t(TRANSLATION_KEYS.preBrewSourceInventoryCaption)}
          onPress={onInventory}
        />
      </TileRow>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.preBrewSourceUnrecordedHint)}
      </Text>
      <Button
        label={t(TRANSLATION_KEYS.preBrewCoffeeNone)}
        variant="tertiary"
        fullWidth
        onPress={onUnrecorded}
      />
    </View>
  );
};
