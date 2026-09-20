import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BrewTimelineStep } from '../../services/resolveBrewTimeline';

import { createBrewStepPanelStyles } from './BrewStepPanel.styles';

export interface BrewStepPanelProps {
  readonly current: BrewTimelineStep;
  readonly stepNumber: number;
  readonly total: number;
}

/**
 * What to do right now, in three lines and no more.
 *
 * The eyebrow says where in the brew this is, the title names the pour, and
 * the sentence under it is the instruction. Everything that used to sit here
 * as well has gone where it is actually looked at: the target weight into the
 * ring beside the countdown, the next step into the pill under it. A panel
 * that answered five questions at once was one where the answer to "what do I
 * do now" had to be found among them.
 */
export const BrewStepPanel = ({ current, stepNumber, total }: BrewStepPanelProps): JSX.Element => {
  const styles = useThemedStyles(createBrewStepPanelStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text variant="eyebrowEspresso" tone="accent" align="center">
        {t(TRANSLATION_KEYS.brewModeStepOf, { current: stepNumber, total })}
      </Text>
      <Text variant="displayTitle" tone="onEspresso" align="center">
        {current.step.label}
      </Text>
      {current.step.note === null ? null : (
        <View style={styles.instruction}>
          <Text variant="bodyLead" tone="onEspressoMuted" align="center">
            {current.step.note}
          </Text>
        </View>
      )}
    </View>
  );
};
