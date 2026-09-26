import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createVerdictReasonsStyles } from './VerdictReasons.styles';

const NOTHING = 0;

export interface VerdictLine {
  readonly text: string;
  readonly icon: TileGlyph;
  /** A palette key, so the mark and the sentence cannot land on two colours. */
  readonly color: string;
}

export interface VerdictReasonListProps {
  readonly title: string;
  readonly icon: TileGlyph;
  readonly lines: readonly VerdictLine[];
  readonly muted?: boolean;
}

/**
 * One half of the argument, under its own label.
 *
 * @returns null when there is nothing in it, so an empty "čo som nevidel"
 * heading never appears - which would read as the app having seen everything.
 */
export const VerdictReasonList = ({
  title,
  icon,
  lines,
  muted = false,
}: VerdictReasonListProps): JSX.Element | null => {
  const styles = useThemedStyles(createVerdictReasonsStyles);
  const theme = useTheme();

  if (lines.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.group}>
      <View style={styles.groupLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={theme.size.iconSmall}
          color={muted ? theme.colors.onSurfaceVariant : theme.colors.onFresh}
        />
        <Text variant="eyebrow" tone="muted">
          {title}
        </Text>
      </View>
      <View style={styles.lines}>
        {lines.map((line: VerdictLine): JSX.Element => (
          <View key={line.text} style={styles.line}>
            <MaterialCommunityIcons
              name={line.icon}
              size={theme.size.iconMedium}
              color={line.color}
            />
            <View style={styles.lineBody}>
              <Text variant="bodyText" tone={muted ? 'muted' : 'default'}>
                {line.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
