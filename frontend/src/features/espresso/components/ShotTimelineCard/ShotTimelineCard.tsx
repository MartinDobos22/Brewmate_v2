import type { ShotTimelineEntry } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { ShotTimeline } from '../../hooks';

import { createShotTimelineCardStyles } from './ShotTimelineCard.styles';
import { ShotTimelineRow } from './ShotTimelineRow';

export interface ShotTimelineCardProps {
  readonly timeline: ShotTimeline;
}

const NOTHING = 0;

/**
 * The run of shots, oldest first.
 *
 * The whole run rather than the last shot, because a dial-in is only readable
 * as a sequence: two shots that both ran long say nothing on their own, and
 * "každý ďalší bol bližšie" says the change is working. It is also exactly
 * what the answer is reasoning about, drawn from the same derivation, so the
 * chart and the advice cannot disagree.
 */
export const ShotTimelineCard = ({ timeline }: ShotTimelineCardProps): JSX.Element | null => {
  const styles = useThemedStyles(createShotTimelineCardStyles);
  const { t } = useTranslation();

  if (timeline.entries.length === NOTHING) {
    return null;
  }

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.dialInTimelineTitle)}</Text>
      <View style={styles.list}>
        {timeline.entries.map((entry: ShotTimelineEntry): JSX.Element => (
          <ShotTimelineRow key={entry.brewLogId} entry={entry} />
        ))}
      </View>
    </Card>
  );
};
