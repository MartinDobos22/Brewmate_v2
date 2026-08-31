import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useCoffeeSource } from '../../hooks/useCoffeeSource';

import { CoffeeSourceStageContent } from './CoffeeSourceStageContent';

export interface BrewCoffeeSourceScreenProps {
  /** Called with the coffee, or with null when it is not written down anywhere. */
  readonly onChoose: (bag: CoffeeBag | null) => void;
}

/**
 * The first screen of a brew: which coffee, and how the app is to learn about
 * it.
 *
 * It is its own screen rather than the first card on the brewing form because
 * the two answers lead somewhere genuinely different - a list, or a camera -
 * and because it is the only question here that can be answered before
 * anything else is known. Everything further down that form depends on it:
 * the dose window, the resting state, the roast the recipe is written around.
 * Asked as one card among six, it was scrolled past.
 *
 * A photographed bag lands in the cupboard on its way through. That is not
 * bookkeeping for its own sake - a bag the app knows carries a roast date and
 * a roast level, and those two facts change a recipe more than anything else
 * on this screen. The alternative is a sentence of free text, which is exactly
 * what "Nemám ju zapísanú" still is for anybody who wants it.
 */
export const BrewCoffeeSourceScreen = ({ onChoose }: BrewCoffeeSourceScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const source = useCoffeeSource(onChoose);

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.preBrewSourceTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.preBrewSourceIntro)}
      </Text>
      <CoffeeSourceStageContent
        source={source}
        onChoose={onChoose}
        onUnrecorded={(): void => {
          onChoose(null);
        }}
      />
    </Screen>
  );
};
