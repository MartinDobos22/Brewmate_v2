import type { BrewConstraints } from '@brewmate/shared';
import type { JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BrewConstraintOption } from '../../constants';

import { createBrewConstraintsSectionStyles } from './BrewConstraintsSection.styles';
import { CHECK_MARKS } from './checkMarks';

export interface BrewConstraintRowProps {
  readonly option: BrewConstraintOption;
  readonly isSet: boolean;
  readonly onToggle: (name: keyof BrewConstraints, isSet: boolean) => void;
}

/** One thing somebody does not have, and one line saying what that means. */
export const BrewConstraintRow = ({
  option,
  isSet,
  onToggle,
}: BrewConstraintRowProps): JSX.Element => {
  const styles = useThemedStyles(createBrewConstraintsSectionStyles);
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={(): void => {
        onToggle(option.name, !isSet);
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSet }}
      accessibilityLabel={t(option.labelKey)}
      accessibilityHint={t(option.hintKey)}
    >
      <View style={styles.row}>
        <View style={[styles.box, isSet && styles.boxChecked]}>
          <Text variant="labelMedium" tone={isSet ? 'onPrimary' : 'muted'}>
            {isSet ? CHECK_MARKS.checked : CHECK_MARKS.unchecked}
          </Text>
        </View>
        <View style={styles.rowText}>
          <Text variant="bodyMedium">{t(option.labelKey)}</Text>
          <Text variant="bodySmall" tone="muted">
            {t(option.hintKey)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
