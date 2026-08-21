import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles, type RadiusToken } from '../../../../theme';
import { PREVIEW_RADIUS_TOKENS } from '../../constants';
import { SectionBlock } from '../SectionBlock';

import { boxRadius, createShapeSectionStyles } from './ShapeSection.styles';

export const ShapeSection = (): JSX.Element => {
  const styles = useThemedStyles(createShapeSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionRadius)} inline>
      {PREVIEW_RADIUS_TOKENS.map((token: RadiusToken): JSX.Element => (
        <View key={token} style={styles.item}>
          <View style={[styles.box, boxRadius(theme.radius[token])]} />
          <Text variant="labelSmall" tone="muted" numeric>
            {token}
          </Text>
        </View>
      ))}
    </SectionBlock>
  );
};
