import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BREW_RATIO_MAX, BREW_RATIO_MIN, type BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { CalculatorStepper, Card, InfoNote, Slider, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { AMOUNT_STEPS, CALCULATOR_ICONS } from '../../constants';
import type { BrewAmountWarning } from '../../services/checkBrewAmounts';
import { seedsAmounts } from '../../services/seedsAmounts';
import type { BrewAmountsControl } from '../../hooks/useBrewAmounts';

import { createPreBrewAmountsSectionStyles } from './PreBrewAmountsSection.styles';
import { RATIO_RANGE_PADDING, clampRatioRange } from './ratioRange';

const NO_CUPS = 0;

export interface PreBrewAmountsSectionProps {
  readonly control: BrewAmountsControl;
  readonly method: BrewMethod;
  readonly warnings: readonly BrewAmountWarning[];
}

/**
 * The two-way calculator, with the numbers set at the size of the decision.
 *
 * Three controls over two facts, so any one of them moves exactly one other -
 * the rules for which live in `resolveBrewAmounts`. The two weights are the
 * largest type in the app outside brew mode, because they are what somebody
 * came to this screen to adjust; everything else on it is a condition on them.
 *
 * The slider's window is the method's own ratio range widened a little,
 * because somebody who wants to brew outside what the catalogue calls usual is
 * allowed to, and a slider that stops at the edge of someone else's opinion is
 * a slider that argues. Its ends are printed, because a slider says how far
 * along something is and never what along means.
 *
 * The line at the bottom says where the proposal came from - the method's
 * middle, or this person's own cups once there are enough of them. That line
 * is the whole of what the brewing profile shows: it is never drawn, because
 * nobody needs a chart of how they brew, only numbers that are already theirs.
 *
 * The warnings underneath describe rather than block, and they are marked
 * notes rather than orange sentences: the person holding the brewer knows
 * things the app does not.
 */
export const PreBrewAmountsSection = ({
  control,
  method,
  warnings,
}: PreBrewAmountsSectionProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewAmountsSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { amounts, isEspresso } = control;
  const range = clampRatioRange(method, BREW_RATIO_MIN, BREW_RATIO_MAX, RATIO_RANGE_PADDING);
  const waterLabel = t(
    isEspresso ? TRANSLATION_KEYS.preBrewYieldLabel : TRANSLATION_KEYS.preBrewWaterLabel,
  );

  return (
    <Card depth="emphasis">
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={CALCULATOR_ICONS.section}
          size={theme.size.iconSmall}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="sectionHeading">{t(TRANSLATION_KEYS.preBrewAmountsSection)}</Text>
        <Text variant="captionSmall" tone="muted">
          {t(TRANSLATION_KEYS.preBrewAmountsHeaderHint)}
        </Text>
      </View>
      <CalculatorStepper
        label={t(TRANSLATION_KEYS.preBrewDoseLabel)}
        icon={CALCULATOR_ICONS.dose}
        formattedValue={formatGrams(amounts.doseGrams)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
        decreaseLabel={t(TRANSLATION_KEYS.decrease)}
        increaseLabel={t(TRANSLATION_KEYS.increase)}
        onChangeValue={control.setDoseGrams}
        onDecrease={(): void => {
          control.setDoseGrams(amounts.doseGrams - AMOUNT_STEPS.dose);
        }}
        onIncrease={(): void => {
          control.setDoseGrams(amounts.doseGrams + AMOUNT_STEPS.dose);
        }}
      />
      <View style={styles.divider} />
      <CalculatorStepper
        label={waterLabel}
        icon={CALCULATOR_ICONS.water}
        formattedValue={formatGrams(amounts.waterGrams)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
        decreaseLabel={t(TRANSLATION_KEYS.decrease)}
        increaseLabel={t(TRANSLATION_KEYS.increase)}
        onChangeValue={control.setWaterGrams}
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
      <Slider
        label={t(TRANSLATION_KEYS.preBrewRatioLabel)}
        icon={CALCULATOR_ICONS.ratio}
        value={amounts.ratio}
        formattedValue={formatRatio(amounts.ratio)}
        range={range}
        minLabel={formatRatio(range.min)}
        maxLabel={formatRatio(range.max)}
        onChange={control.setRatioValue}
      />
      {warnings.map((warning: BrewAmountWarning): JSX.Element => (
        <InfoNote
          key={warning.messageKey}
          tone="caution"
          text={t(warning.messageKey, warning.values)}
        />
      ))}
      <View style={styles.notes}>
        <Text variant="captionSmall" tone="muted">
          {seedsAmounts(control.habit)
            ? t(TRANSLATION_KEYS.preBrewHabitReason, {
                method: method.nameSk,
                count: control.habit?.cupCount ?? NO_CUPS,
              })
            : t(TRANSLATION_KEYS.preBrewSuggestionReason, { method: method.nameSk })}
        </Text>
      </View>
    </Card>
  );
};
