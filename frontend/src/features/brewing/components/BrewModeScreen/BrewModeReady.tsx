import type { BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { BrewRecipeFacts } from './BrewRecipeFacts';
import { createBrewModeScreenStyles } from './BrewModeScreen.styles';

export interface BrewModeReadyProps {
  readonly params: BrewParams;
  readonly hasSchedule: boolean;
}

/**
 * The screen before the clock starts, which is the setup rather than the brew.
 *
 * It holds the numbers somebody weighs out against, and no ring. The ring is
 * the running state: an empty one sitting here would read as a brew that had
 * started and stalled, which is the one thing a countdown must never suggest.
 */
export const BrewModeReady = ({ params, hasSchedule }: BrewModeReadyProps): JSX.Element => {
  const styles = useThemedStyles(createBrewModeScreenStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.middle}>
      <Text variant="displayTitle" tone="onEspresso" align="center">
        {t(
          hasSchedule ? TRANSLATION_KEYS.brewModeReadyTitle : TRANSLATION_KEYS.brewModeSimpleTitle,
        )}
      </Text>
      <Text variant="bodyLead" tone="onEspressoMuted" align="center">
        {t(hasSchedule ? TRANSLATION_KEYS.brewModeReadyBody : TRANSLATION_KEYS.brewModeSimpleBody)}
      </Text>
      <BrewRecipeFacts params={params} />
    </View>
  );
};
