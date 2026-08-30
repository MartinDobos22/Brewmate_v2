import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';

export interface VerdictPointProps {
  readonly icon: TileGlyph;
  readonly text: string;
  readonly muted?: boolean;
}

/**
 * One line of the argument, with a mark to hang it on.
 *
 * The mark is deliberately not a tick. Half of these sentences argue against
 * the coffee - "praženie je iné, než aké ti zvykne sadnúť" is a reason, and as
 * welcome as one for it - and a green check beside that would turn the
 * argument into an endorsement of itself.
 */
export const VerdictPoint = ({ icon, text, muted = false }: VerdictPointProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const theme = useTheme();

  return (
    <View style={styles.point}>
      <MaterialCommunityIcons
        name={icon}
        size={theme.size.iconSmall}
        color={muted ? theme.colors.outline : theme.colors.onSurfaceVariant}
      />
      <Text variant="bodySmall" tone={muted ? 'muted' : 'default'}>
        {text}
      </Text>
    </View>
  );
};
