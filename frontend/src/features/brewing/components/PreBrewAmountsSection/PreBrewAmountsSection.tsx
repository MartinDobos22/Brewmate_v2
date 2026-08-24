import { BREW_RATIO_MAX, BREW_RATIO_MIN, type BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, NumberStepper, Slider, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { AMOUNT_STEPS } from '../../constants';
import type { BrewAmountWarning } from '../../services/checkBrewAmounts';
import type { BrewAmountsControl } from '../../hooks/useBrewAmounts';

import { createPreBrewAmountsSectionStyles } from './PreBrewAmountsSection.styles';
import { RATIO_RANGE_PADDING, clampRatioRange } from './ratioRange';

export interface PreBrewAmountsSectionProps {
  readonly control: BrewAmountsControl;
  readonly method: BrewMethod;
  readonly warnings: readonly BrewAmountWarning[];
}

/**
 * The two-way calculator, and the one sentence saying who filled it in.
 *
 * Three controls over two facts, so any one of them moves exactly one other -
 * the rules for which live in `resolveBrewAmounts`. The slider's window is the
 * method's own ratio range widened a little, because a person who wants to
 * brew outside what the catalogue calls usual is allowed to, and a slider that
 * stops at the edge of somebody else's opinion is a slider that argues.
 *
 * The warnings underneath describe rather than block. The person holding the
 * brewer knows things the app does not.
 */
export const PreBrewAmountsSection = ({
  control,
  method,
  warnings,
}: PreBrewAmountsSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewAmountsSectionStyles);
  const { t } = useTranslation();
  const { amounts, isEspresso } = control;

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.preBrewAmountsSection)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.preBrewAmountsHint)}
      </Text>
      <View style={styles.steppers}>
        <NumberStepper
          label={t(TRANSLATION_KEYS.preBrewDoseLabel)}
          formattedValue={formatGrams(amounts.doseGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
          decreaseLabel={t(TRANSLATION_KEYS.decrease)}
          increaseLabel={t(TRANSLATION_KEYS.increase)}
          onDecrease={(): void => {
            control.setDoseGrams(amounts.doseGrams - AMOUNT_STEPS.dose);
          }}
          onIncrease={(): void => {
            control.setDoseGrams(amounts.doseGrams + AMOUNT_STEPS.dose);
          }}
        />
        <NumberStepper
          label={t(
            isEspresso ? TRANSLATION_KEYS.preBrewYieldLabel : TRANSLATION_KEYS.preBrewWaterLabel,
          )}
          formattedValue={formatGrams(amounts.waterGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
          decreaseLabel={t(TRANSLATION_KEYS.decrease)}
          increaseLabel={t(TRANSLATION_KEYS.increase)}
          onDecrease={(): void => {
            control.setWaterGrams(
              amounts.waterGrams - (isEspresso ? AMOUNT_STEPS.espressoYield : AMOUNT_STEPS.water),
            );
          }}
          onIncrease={(): void => {
            control.setWaterGrams(
              amounts.waterGrams + (isEspresso ? AMOUNT_STEPS.espressoYield : AMOUNT_STEPS.water),
            );
          }}
        />
      </View>
      <Slider
        label={t(TRANSLATION_KEYS.preBrewRatioLabel)}
        value={amounts.ratio}
        formattedValue={formatRatio(amounts.ratio)}
        range={clampRatioRange(method, BREW_RATIO_MIN, BREW_RATIO_MAX, RATIO_RANGE_PADDING)}
        onChange={control.setRatioValue}
      />
      <View style={styles.notes}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewSuggestionNote)}
        </Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewSuggestionReason, { method: method.nameSk })}
        </Text>
        {warnings.map((warning: BrewAmountWarning): JSX.Element => (
          <Text key={warning.messageKey} variant="bodySmall" tone="tertiary">
            {t(warning.messageKey, warning.values)}
          </Text>
        ))}
      </View>
    </Card>
  );
};
