import type { Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { buildBrewModeRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetSwitcher } from '../../../inventory/components';
import { useBrewSetup } from '../../hooks/useBrewSetup';
import { BrewCoffeeSourceScreen } from '../BrewCoffeeSourceScreen';
import { PreBrewPlanCard } from '../PreBrewPlanCard';

import { PreBrewExtras } from './PreBrewExtras';
import { PreBrewSections } from './PreBrewSections';

/**
 * Everything that gets decided before a single token is spent.
 *
 * The order is the order somebody standing in a kitchen can answer in: where
 * they are, what coffee, what they are brewing it in, what is missing today,
 * what water, and how much of each. Only then is a recipe asked for - because
 * a recipe written before those answers is a recipe written for a kitchen
 * nobody is standing in.
 *
 * The plan card at the end is what turns that list of questions back into one
 * decision. Five cards of answers, each scrolled past, used to end at a button
 * with nothing between them and it; now the whole thing is legible in four
 * lines directly above the commitment.
 */
export interface PreBrewScreenProps {
  /** Set when somebody arrived from a coffee's own screen wanting to brew it. */
  readonly initialBagId?: string;
}

export const PreBrewScreen = ({ initialBagId }: PreBrewScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useBrewSetup(initialBagId);

  /*
   * The coffee comes first, and on its own screen.
   *
   * Everything below it on the form is written around the answer - the dose
   * window, whether the bag is even ready, the roast the recipe assumes - and
   * the answer can arrive from a camera as easily as from the cupboard. Asked
   * as the first of six cards it was scrolled past; asked here it is the only
   * thing on the screen.
   */
  if (!setup.hasChosenCoffee) {
    return <BrewCoffeeSourceScreen onChoose={setup.chooseBag} />;
  }

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.preBrewTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.preBrewIntro)}
      </Text>
      <EquipmentSetSwitcher />
      <PreBrewSections setup={setup} />
      <PreBrewPlanCard
        setup={setup}
        onWritten={(recipe: Recipe): void => {
          router.replace(buildBrewModeRoute(recipe.id, setup.activeSet?.id));
        }}
      />
      <PreBrewExtras setup={setup} />
    </Screen>
  );
};
