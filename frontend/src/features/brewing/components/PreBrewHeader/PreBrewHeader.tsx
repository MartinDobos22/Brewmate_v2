import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { EspressoHeader } from '../../../../components/layout';
import { ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

import { PreBrewCoffeeRow } from './PreBrewCoffeeRow';
import { PreBrewNoCoffeeRow } from './PreBrewNoCoffeeRow';

export interface PreBrewHeaderProps {
  readonly bag: CoffeeBag | null;
  readonly description: string;
  readonly hasCupboard: boolean;
  readonly onChange: () => void;
}

const EMPTY = '';

/**
 * What this screen is, and which coffee it is about.
 *
 * The coffee leads because everything below is written around it - the dose
 * window, whether the bag is even ready, the roast the recipe assumes. An
 * empty cupboard puts the same row in dashes rather than hiding it: a missing
 * coffee is a fact about this morning, not a step somebody failed to complete,
 * and the recipe is never blocked on it.
 */
export const PreBrewHeader = ({
  bag,
  description,
  hasCupboard,
  onChange,
}: PreBrewHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const hasAnswer = bag !== null || description.trim() !== EMPTY;

  return (
    <EspressoHeader>
      <ScreenIntro ground="espresso" title={t(TRANSLATION_KEYS.preBrewTitle)} />
      {hasAnswer || hasCupboard ? (
        <PreBrewCoffeeRow bag={bag} description={description} onChange={onChange} />
      ) : (
        <PreBrewNoCoffeeRow onPhotograph={onChange} onSkip={onChange} />
      )}
    </EspressoHeader>
  );
};
