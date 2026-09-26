import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createTasteSuggestionStyles } from './TasteSuggestionCard.styles';

export interface SuggestionChangeProps {
  readonly icon: TileGlyph;
  readonly text: string;
}

/** One line of what accepting this would actually write into the profile. */
export const SuggestionChange = ({ icon, text }: SuggestionChangeProps): JSX.Element => {
  const styles = useThemedStyles(createTasteSuggestionStyles);
  const theme = useTheme();

  return (
    <View style={styles.change}>
      <MaterialCommunityIcons
        name={icon}
        size={theme.size.iconRow}
        color={theme.colors.accentOnEspresso}
      />
      <View style={styles.line}>
        <Text variant="bodyText" tone="onEspresso">
          {text}
        </Text>
      </View>
    </View>
  );
};
