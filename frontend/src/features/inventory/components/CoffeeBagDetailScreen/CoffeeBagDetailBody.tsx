import type { CoffeeBag, Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { TileRow } from '../../../../components/layout';
import { SectionHeading, Tile } from '../../../../components/ui';
import { buildBrewRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BagRatingCard } from '../../../bagRatings/components';
import { CoffeeTasteSection } from '../../../coffeeTaste/components';
import { INVENTORY_TILE_ICONS } from '../../constants';

import { BagFinishButton } from './BagFinishButton';
import { BagRecipeHistory } from './BagRecipeHistory';
import { CoffeeBagHeader } from './CoffeeBagHeader';
import { CoffeeBagInfoCard } from './CoffeeBagInfoCard';
import { CoffeeBagStateCard } from './CoffeeBagStateCard';

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
 * What somebody thought of it sits under what it will taste like - the
 * estimate and the verdict of the person drinking it, one above the other.
 *
 * Finishing the bag asks how it was, archives rather than deletes, and returns
 * to the cupboard - a screen about a bag that is no longer in the cupboard is
 * a screen with nothing left to say.
 */
export const CoffeeBagDetailBody = ({ bag, recipes }: CoffeeBagDetailBodyProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

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
      <BagRatingCard bag={bag} />

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

      <BagFinishButton bag={bag} />
    </>
  );
};
