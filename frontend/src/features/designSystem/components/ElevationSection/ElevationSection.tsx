import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles, type ElevationToken } from '../../../../theme';
import { PREVIEW_ELEVATION_TOKENS } from '../../constants';
import { SectionBlock } from '../SectionBlock';

import { createElevationSectionStyles, elevationStyle } from './ElevationSection.styles';

export const ElevationSection = (): JSX.Element => {
  const styles = useThemedStyles(createElevationSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionElevation)} inline>
      {PREVIEW_ELEVATION_TOKENS.map((token: ElevationToken): JSX.Element => (
        <View key={token} style={styles.item}>
          <View style={[styles.box, elevationStyle(theme.colors.shadow, theme.elevation[token])]} />
          <Text variant="labelSmall" tone="muted">
            {token}
          </Text>
        </View>
      ))}
    </SectionBlock>
  );
};
