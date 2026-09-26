import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { EspressoHeader, HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useCoffeeSource } from '../../hooks/useCoffeeSource';

import { CoffeeSourceStageContent } from './CoffeeSourceStageContent';
import { createBrewCoffeeSourceStyles } from './BrewCoffeeSourceScreen.styles';

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
 *
 * "Späť" from the list, the form or a refused photograph is the question
 * again; from the question itself it is wherever somebody came from.
 *
 * The question is asked in the same block the rest of the brewing tab is led
 * by. This screen and the form behind it are one screen as far as anybody
 * using them is concerned, and answering one question should not turn a light
 * page into a dark-headed one.
 */
export const BrewCoffeeSourceScreen = ({ onChoose }: BrewCoffeeSourceScreenProps): JSX.Element => {
  const styles = useThemedStyles(createBrewCoffeeSourceStyles);
  const { t } = useTranslation();
  const source = useCoffeeSource(onChoose);

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES} onBack={source.stepBack}>
      <EspressoHeader>
        <ScreenIntro
          ground="espresso"
          title={t(TRANSLATION_KEYS.preBrewSourceTitle)}
          lead={t(TRANSLATION_KEYS.preBrewSourceIntro)}
        />
      </EspressoHeader>
      <View style={styles.content}>
        <CoffeeSourceStageContent
          source={source}
          onChoose={onChoose}
          onUnrecorded={(): void => {
            onChoose(null);
          }}
        />
      </View>
    </Screen>
  );
};
