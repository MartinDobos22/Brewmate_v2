import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createTimelineEntryStyles } from './TimelineEntryCard.styles';

export interface TimelineCountProps {
  readonly icon: TileGlyph;
  readonly label: string;
}

/** What came of this version: cups made, and things said about them. */
export const TimelineCount = ({ icon, label }: TimelineCountProps): JSX.Element => {
  const styles = useThemedStyles(createTimelineEntryStyles);
  const theme = useTheme();

  return (
    <View style={styles.count}>
      <MaterialCommunityIcons
        name={icon}
        size={theme.size.iconSmall}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
};
