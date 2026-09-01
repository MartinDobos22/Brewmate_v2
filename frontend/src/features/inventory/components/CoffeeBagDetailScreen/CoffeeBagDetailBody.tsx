import type { CoffeeBag, Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { TileRow } from '../../../../components/layout';
import { Button, SectionHeading, Tile } from '../../../../components/ui';
import { buildBrewRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { CoffeeTasteSection } from '../../../coffeeTaste/components';
import { INVENTORY_TILE_ICONS } from '../../constants';
import { useArchiveCoffeeBag } from '../../hooks';

import { BagRecipeHistory } from './BagRecipeHistory';
import { CoffeeBagHeader } from './CoffeeBagHeader';
import { CoffeeBagInfoCard } from './CoffeeBagInfoCard';
import { CoffeeBagStateCard } from './CoffeeBagStateCard';
import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface CoffeeBagDetailBodyProps {
  readonly bag: CoffeeBag;
  readonly recipes: readonly Recipe[];
}

/**
 * The screen, in the order somebody came here for it.
 *
 * Which coffee this is, what state it is in, what can be done about it, what
 * it will taste like, how it has been brewed, and only then what the label
 * said. The estimate sits above the recipes rather than beside the label,
 * because it answers the question somebody opened this screen with - "what am
 * I about to drink" - rather than reporting what was printed on the bag. The one action that used
 * to be missing entirely is the obvious one: a coffee's own screen with no way
 * to brew it is a page about a thing rather than a thing you can use.
 *
 * Finishing the bag archives rather than deletes, and returns to the cupboard
 * - a screen about a bag that is no longer in the cupboard is a screen with
 * nothing left to say.
 */
export const CoffeeBagDetailBody = ({ bag, recipes }: CoffeeBagDetailBodyProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const archive = useArchiveCoffeeBag();

  return (
    <>
      <CoffeeBagHeader bag={bag} />
      <CoffeeBagStateCard bag={bag} />
      <TileRow>
        <Tile
          icon={INVENTORY_TILE_ICONS.brew}
          tone="primary"
          title={t(TRANSLATION_KEYS.bagDetailBrewTitle)}
          caption={t(TRANSLATION_KEYS.bagDetailBrewCaption)}
          onPress={(): void => {
            router.push(buildBrewRoute(bag.id));
          }}
        />
      </TileRow>

      <CoffeeTasteSection coffee={bag} />

      <SectionHeading
        title={t(TRANSLATION_KEYS.bagRecipesTitle)}
        caption={t(TRANSLATION_KEYS.bagDetailRecipesCaption)}
      />
      <BagRecipeHistory recipes={recipes} bagId={bag.id} />

      <SectionHeading
        title={t(TRANSLATION_KEYS.bagDetailLabelSection)}
        caption={t(TRANSLATION_KEYS.bagDetailLabelCaption)}
      />
      <CoffeeBagInfoCard bag={bag} />

      <View style={styles.archive}>
        <Button
          label={t(TRANSLATION_KEYS.inventoryBagArchive)}
          variant="tertiary"
          size="small"
          loading={archive.isPending}
          onPress={(): void => {
            archive.mutate(bag.id, {
              onSuccess: (): void => {
                router.back();
              },
            });
          }}
        />
      </View>
    </>
  );
};
