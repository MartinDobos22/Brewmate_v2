import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import type { BrewSetup } from '../../hooks/useBrewSetup';
import { PreBrewSubmit } from '../PreBrewScreen/PreBrewSubmit';

import { createPreBrewPlanCardStyles } from './PreBrewPlanCard.styles';
import { PreBrewPlanRow } from './PreBrewPlanRow';

const EMPTY = '';

export interface PreBrewPlanCardProps {
  readonly setup: BrewSetup;
  readonly onWritten: (recipe: Recipe) => void;
}

/**
 * What is about to be brewed, on one card, above the button that commits to
 * it.
 *
 * Everything here was decided further up the screen, in five separate cards
 * somebody has already scrolled past. By the time they reach the button the
 * dose is four screens away, and the only way to check what they were about to
 * spend a model call on was to scroll back through all of it. A recipe is
 * written once and followed for the next four minutes; being able to read the
 * whole decision in four lines first is the difference between committing and
 * guessing.
 *
 * It reports rather than edits - every value here is changed where it was
 * chosen. Two places to set a dose would eventually disagree about what the
 * dose is.
 */
export const PreBrewPlanCard = ({ setup, onWritten }: PreBrewPlanCardProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewPlanCardStyles);
  const { t } = useTranslation();
  const { amounts } = setup;

  const coffee =
    setup.bag?.name ??
    (setup.coffeeDescription.trim() === EMPTY
      ? t(TRANSLATION_KEYS.preBrewPlanUnknownCoffee)
      : setup.coffeeDescription);

  return (
    <Card variant="containerHigh">
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewPlanTitle)}</Text>
      {setup.method === undefined ? null : (
        <View style={styles.rows}>
          <PreBrewPlanRow label={t(TRANSLATION_KEYS.preBrewPlanCoffee)} value={coffee} />
          <PreBrewPlanRow
            label={t(TRANSLATION_KEYS.preBrewPlanMethod)}
            value={setup.method.nameSk}
          />
          <PreBrewPlanRow
            label={t(TRANSLATION_KEYS.preBrewPlanAmounts)}
            numeric
            value={`${formatGrams(amounts.doseGrams)} / ${formatGrams(amounts.waterGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`}
          />
          <PreBrewPlanRow
            label={t(TRANSLATION_KEYS.preBrewPlanRatio)}
            numeric
            value={formatRatio(amounts.ratio)}
          />
        </View>
      )}
      <PreBrewSubmit setup={setup} onWritten={onWritten} />
    </Card>
  );
};
