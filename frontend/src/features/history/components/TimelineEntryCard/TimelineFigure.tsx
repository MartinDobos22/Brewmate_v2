import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createTimelineEntryStyles } from './TimelineEntryCard.styles';

export interface TimelineFigureProps {
  readonly value: string;
  readonly labelKey: TranslationKey;
  /** The ratio, which is arithmetic over the two weights rather than one of them. */
  readonly derived?: boolean;
}

/** One of the three numbers a version is made of. */
export const TimelineFigure = ({
  value,
  labelKey,
  derived = false,
}: TimelineFigureProps): JSX.Element => {
  const styles = useThemedStyles(createTimelineEntryStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.figure}>
      <Text variant={derived ? 'numericInline' : 'numericLeadMinor'} numeric>
        {value}
      </Text>
      <Text variant="eyebrow" tone="muted" numberOfLines={1}>
        {t(labelKey)}
      </Text>
    </View>
  );
};
