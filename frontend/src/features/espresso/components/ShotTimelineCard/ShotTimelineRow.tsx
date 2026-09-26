import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DIAL_IN_CHANGES, type ShotTimelineEntry } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createShotTimelineCardStyles } from './ShotTimelineCard.styles';
import {
  DIAL_IN_CHANGE_KEYS,
  DIAL_IN_DIRECTION_KEYS,
  SHOT_TREND_ICON_COLORS,
  SHOT_TREND_ICONS,
  SHOT_TREND_KEYS,
  SHOT_TREND_TONES,
} from './shotTimelineLabels';

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
 *
 * Whether it worked carries an arrow as well as a colour. It is the one fact
 * the whole run is about, and it was told apart from its opposite by the
 * difference between an ochre and a grey.
 */
export const ShotTimelineRow = ({ entry }: ShotTimelineRowProps): JSX.Element => {
  const styles = useThemedStyles(createShotTimelineCardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const direction = entry.direction;

  return (
    <View style={styles.entry}>
      <Text variant="eyebrow">
        {t(TRANSLATION_KEYS.dialInShotNumber, { number: entry.shotNumber })}
      </Text>
      <View style={styles.facts}>
        <Text variant="caption" tone="secondary" numeric>
          {t(TRANSLATION_KEYS.dialInShotFacts, {
            dose: entry.doseGrams ?? UNKNOWN,
            yield: entry.yieldGrams ?? UNKNOWN,
            time: entry.timeSeconds ?? UNKNOWN,
          })}
        </Text>
        {entry.grindSetting === null ? null : (
          <Text variant="caption" tone="muted" numeric>
            {t(TRANSLATION_KEYS.dialInGrindAt, { setting: entry.grindSetting })}
          </Text>
        )}
      </View>
      <View style={styles.trend}>
        <MaterialCommunityIcons
          name={SHOT_TREND_ICONS[entry.trend]}
          size={theme.size.iconTiny}
          color={theme.colors[SHOT_TREND_ICON_COLORS[entry.trend]]}
        />
        <Text variant="caption" tone={SHOT_TREND_TONES[entry.trend]}>
          {entry.change === DIAL_IN_CHANGES.none || direction === null
            ? t(DIAL_IN_CHANGE_KEYS[entry.change])
            : t(TRANSLATION_KEYS.dialInChangeSummary, {
                change: t(DIAL_IN_CHANGE_KEYS[entry.change]),
                direction: t(DIAL_IN_DIRECTION_KEYS[direction]),
                trend: t(SHOT_TREND_KEYS[entry.trend]),
              })}
        </Text>
      </View>
    </View>
  );
};
