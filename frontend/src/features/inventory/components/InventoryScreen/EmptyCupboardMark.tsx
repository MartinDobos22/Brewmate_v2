import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../../theme';
import { EMPTY_CUPBOARD_ICON } from '../../constants';

import { createEmptyCupboardMarkStyles } from './EmptyCupboardMark.styles';

/** Two dashed rings round the glyph of the thing that is not there yet. */
export const EmptyCupboardMark = (): JSX.Element => {
  const styles = useThemedStyles(createEmptyCupboardMarkStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.outer} />
      <View style={styles.inner} />
      <MaterialCommunityIcons
        name={EMPTY_CUPBOARD_ICON}
        size={theme.size.emptyMarkGlyph}
        color={theme.colors.onSurfaceEmptyStrong}
      />
    </View>
  );
};
