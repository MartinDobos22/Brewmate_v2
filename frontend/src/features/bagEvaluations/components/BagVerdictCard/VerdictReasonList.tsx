import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';
import { VerdictPoint } from './VerdictPoint';

const NOTHING = 0;

export interface VerdictReasonListProps {
  readonly title: string;
  readonly lines: readonly string[];
  readonly icon: TileGlyph;
  readonly muted?: boolean;
}

/**
 * One half of the argument.
 *
 * @returns null when there is nothing in it, so an empty "čo som nevidel"
 * heading never appears - which would read as the app having seen everything.
 */
export const VerdictReasonList = ({
  title,
  lines,
  icon,
  muted = false,
}: VerdictReasonListProps): JSX.Element | null => {
  const styles = useThemedStyles(createBagVerdictCardStyles);

  if (lines.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text variant="titleSmall">{title}</Text>
      <View style={styles.points}>
        {lines.map((line: string): JSX.Element => (
          <VerdictPoint key={line} icon={icon} text={line} muted={muted} />
        ))}
      </View>
    </View>
  );
};
