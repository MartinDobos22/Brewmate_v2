import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles, type SpacingToken } from '../../../../theme';
import { PREVIEW_SPACING_TOKENS } from '../../constants';
import { SectionBlock } from '../SectionBlock';

import { barWidth, createSpacingSectionStyles } from './SpacingSection.styles';

export const SpacingSection = (): JSX.Element => {
  const styles = useThemedStyles(createSpacingSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionSpacing)}>
      {PREVIEW_SPACING_TOKENS.map((token: SpacingToken): JSX.Element => (
        <View key={token} style={styles.row}>
          <View style={[styles.bar, barWidth(theme.spacing[token])]} />
          <Text variant="labelSmall" tone="muted" numeric>
            {token}
          </Text>
        </View>
      ))}
    </SectionBlock>
  );
};
