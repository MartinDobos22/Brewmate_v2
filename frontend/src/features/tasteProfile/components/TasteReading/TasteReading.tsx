import type { TasteAxes, TasteAxisConfidence } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { AXIS_BAND_LABEL_KEYS, TASTE_AXIS_LABEL_KEYS } from '../../constants';
import { readTasteAxisReadings, type TasteAxisReading } from '../../services';

import { createTasteReadingStyles } from './TasteReading.styles';

export interface TasteReadingProps {
  readonly axes: TasteAxes;
  readonly axisConfidence: TasteAxisConfidence;
}

/**
 * The web, said out loud.
 *
 * The shape above is what gets read at a glance; this is what somebody reads
 * when they want to know exactly what the app thinks. There is deliberately no
 * number in it. "Kyslosť 7,4" is a measurement of something nobody measured -
 * it is a weighted average of a handful of answers about chocolate and tea -
 * and printing it to one decimal place invites the reader to believe a
 * precision that is not there, and then to argue with the digit rather than
 * with the claim.
 *
 * An axis nobody has said anything about says so rather than being described.
 * The middle of the scale is where the profile stores silence, and "vyvážené
 * telo" is what that silence would sound like if it were allowed to speak.
 */
export const TasteReading = ({ axes, axisConfidence }: TasteReadingProps): JSX.Element => {
  const styles = useThemedStyles(createTasteReadingStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {readTasteAxisReadings(axes, axisConfidence).map((reading: TasteAxisReading): JSX.Element => (
        <View key={reading.axis} style={styles.row}>
          <Text variant="labelMedium" tone="muted">
            {t(TASTE_AXIS_LABEL_KEYS[reading.axis])}
          </Text>
          <Text variant="bodyMedium" tone={reading.known ? 'default' : 'muted'} align="right">
            {reading.known
              ? t(AXIS_BAND_LABEL_KEYS[reading.axis][reading.band])
              : t(TRANSLATION_KEYS.profileAxisUnknown)}
          </Text>
        </View>
      ))}
    </View>
  );
};
