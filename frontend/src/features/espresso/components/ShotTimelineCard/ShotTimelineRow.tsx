import { DIAL_IN_CHANGES, SHOT_TRENDS, type ShotTimelineEntry } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createShotTimelineCardStyles } from './ShotTimelineCard.styles';
import { DIAL_IN_CHANGE_KEYS, DIAL_IN_DIRECTION_KEYS, SHOT_TREND_KEYS } from './shotTimelineLabels';

export interface ShotTimelineRowProps {
  readonly entry: ShotTimelineEntry;
}

const UNKNOWN = '?';

/**
 * One shot, and what was different about it from the one before.
 *
 * The change and the trend are printed together because neither means much
 * alone: "mletie jemnejšie" says what was done, "bližšie k cieľu" says whether
 * it worked, and a dial-in is the argument between those two lines repeated
 * three or four times.
 */
export const ShotTimelineRow = ({ entry }: ShotTimelineRowProps): JSX.Element => {
  const styles = useThemedStyles(createShotTimelineCardStyles);
  const { t } = useTranslation();
  const direction = entry.direction;

  return (
    <View style={styles.entry}>
      <Text variant="labelMedium">
        {t(TRANSLATION_KEYS.dialInShotNumber, { number: entry.shotNumber })}
      </Text>
      <View style={styles.facts}>
        <Text variant="bodySmall" tone="secondary" numeric>
          {t(TRANSLATION_KEYS.dialInShotFacts, {
            dose: entry.doseGrams ?? UNKNOWN,
            yield: entry.yieldGrams ?? UNKNOWN,
            time: entry.timeSeconds ?? UNKNOWN,
          })}
        </Text>
        {entry.grindSetting === null ? null : (
          <Text variant="bodySmall" tone="muted" numeric>
            {t(TRANSLATION_KEYS.dialInGrindAt, { setting: entry.grindSetting })}
          </Text>
        )}
      </View>
      <Text variant="bodySmall" tone={entry.trend === SHOT_TRENDS.further ? 'tertiary' : 'muted'}>
        {entry.change === DIAL_IN_CHANGES.none || direction === null
          ? t(DIAL_IN_CHANGE_KEYS[entry.change])
          : t(TRANSLATION_KEYS.dialInChangeSummary, {
              change: t(DIAL_IN_CHANGE_KEYS[entry.change]),
              direction: t(DIAL_IN_DIRECTION_KEYS[direction]),
              trend: t(SHOT_TREND_KEYS[entry.trend]),
            })}
      </Text>
    </View>
  );
};
