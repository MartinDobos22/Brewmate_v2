import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_NEXT_PILL } from '../../constants';

import { createBrewNextStepPillStyles } from './BrewNextStepPill.styles';

export interface BrewNextStepPillProps {
  readonly label: string;
}

/**
 * What is coming, at a glance and no more.
 *
 * Enough to know a bloom is about to turn into a pour, and small enough that
 * it is never read instead of the step being poured. The word and the step are
 * set in two weights because at this size a single tone would read as one
 * phrase and be scanned as one - and the only part worth taking in is the
 * second half.
 */
export const BrewNextStepPill = ({ label }: BrewNextStepPillProps): JSX.Element => {
  const styles = useThemedStyles(createBrewNextStepPillStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.pill}>
      <Text variant="bodyMuted" tone="onEspressoMuted">
        {t(TRANSLATION_KEYS.brewModeNextPrefix)}
      </Text>
      <Text variant="bodyMuted" tone="accentSoft" numberOfLines={1}>
        {label}
      </Text>
      <MaterialCommunityIcons
        name={BREW_NEXT_PILL.icon}
        size={theme.size.iconSmall}
        color={theme.colors.onEspressoVariant}
      />
    </View>
  );
};
