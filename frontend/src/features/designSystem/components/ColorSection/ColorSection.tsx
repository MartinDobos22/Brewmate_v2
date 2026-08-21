import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles, type ColorPalette } from '../../../../theme';
import { PREVIEW_COLOR_ROLES } from '../../constants';
import { SectionBlock } from '../SectionBlock';

import { createColorSectionStyles, swatchFill } from './ColorSection.styles';

export const ColorSection = (): JSX.Element => {
  const styles = useThemedStyles(createColorSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionColors)}>
      <View style={styles.grid}>
        {PREVIEW_COLOR_ROLES.map((role: keyof ColorPalette): JSX.Element => (
          <View key={role} style={styles.item}>
            <View style={[styles.swatch, swatchFill(theme.colors[role])]} />
            <Text variant="labelSmall" tone="muted">
              {role}
            </Text>
          </View>
        ))}
      </View>
    </SectionBlock>
  );
};
