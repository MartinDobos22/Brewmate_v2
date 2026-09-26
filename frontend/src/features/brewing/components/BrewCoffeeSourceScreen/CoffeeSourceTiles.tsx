import type { JSX } from 'react';
import { View } from 'react-native';

import { TileRow } from '../../../../components/layout';
import { PillButton, Text, Tile } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BAG_PHOTO_SOURCES, type BagPhotoSource } from '../../../bagEvaluations/services';
import { COFFEE_SOURCE_ICONS } from '../../constants';

import { createBrewCoffeeSourceStyles } from './BrewCoffeeSourceScreen.styles';

export interface CoffeeSourceTilesProps {
  /** False where nobody is signed in to read a label for, so there is no camera to open. */
  readonly canPhotograph: boolean;
  readonly onCapture: (source: BagPhotoSource) => void;
  readonly onInventory: () => void;
  readonly onTypeIn: () => void;
  readonly onUnrecorded: () => void;
}

/**
 * Every way a coffee gets into a brew, as tiles of one size.
 *
 * The camera and the cupboard lead, side by side at the same size. Neither is
 * the fallback for the other - they are two ordinary situations, and whichever
 * one somebody is in, the other one being louder would be the screen guessing
 * wrong about them.
 *
 * The library and typing it in are the row under them, as tiles rather than
 * as buttons on a screen further in. A photograph of the bag already on the
 * phone is as ordinary as one about to be taken, and it used to sit behind the
 * camera tile, on a card that offered the camera a second time - which is the
 * one place nobody holding a picture of their coffee thought to look.
 *
 * "Nemám ju zapísanú" is underneath and quieter, because it is none of these:
 * it is the answer for somebody who is not going to write this coffee down at
 * all, and a recipe still gets written for them.
 */
export const CoffeeSourceTiles = ({
  canPhotograph,
  onCapture,
  onInventory,
  onTypeIn,
  onUnrecorded,
}: CoffeeSourceTilesProps): JSX.Element => {
  const styles = useThemedStyles(createBrewCoffeeSourceStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.choices}>
      <View style={styles.grid}>
        <TileRow>
          {canPhotograph ? (
            <Tile
              icon={COFFEE_SOURCE_ICONS.photo}
              tone="primary"
              title={t(TRANSLATION_KEYS.preBrewSourcePhoto)}
              caption={t(TRANSLATION_KEYS.preBrewSourcePhotoCaption)}
              onPress={(): void => {
                onCapture(BAG_PHOTO_SOURCES.camera);
              }}
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
        <TileRow>
          {canPhotograph ? (
            <Tile
              icon={COFFEE_SOURCE_ICONS.library}
              title={t(TRANSLATION_KEYS.preBrewSourceLibrary)}
              caption={t(TRANSLATION_KEYS.preBrewSourceLibraryCaption)}
              onPress={(): void => {
                onCapture(BAG_PHOTO_SOURCES.library);
              }}
            />
          ) : null}
          <Tile
            icon={COFFEE_SOURCE_ICONS.manual}
            title={t(TRANSLATION_KEYS.preBrewSourceManual)}
            caption={t(TRANSLATION_KEYS.preBrewSourceManualCaption)}
            onPress={onTypeIn}
          />
        </TileRow>
      </View>
      <Text variant="bodyText" tone="muted">
        {t(TRANSLATION_KEYS.preBrewSourceUnrecordedHint)}
      </Text>
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.preBrewCoffeeNone)}
        fullWidth
        onPress={onUnrecorded}
      />
    </View>
  );
};
