import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createBrewConstraintsSectionStyles } from './BrewConstraintsSection.styles';
import { CONSTRAINTS_ICONS } from './constraintsIcons';

export interface BrewConstraintsHeaderProps {
  readonly isOpen: boolean;
  readonly count: number;
  readonly onToggle: () => void;
}

const NOTHING = 0;

/**
 * The header, built to look like the thing it is: a row that opens.
 *
 * A title, a line saying what is behind it, and a chevron - the same shape as
 * a dropdown's closed field, deliberately, because on this screen it now is
 * one of several rows that open into something. The count stays in it, because
 * a folded section hiding three ticks nobody can see is worse than no section
 * at all.
 */
export const BrewConstraintsHeader = ({
  isOpen,
  count,
  onToggle,
}: BrewConstraintsHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createBrewConstraintsSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const isEmpty = count === NOTHING;

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.header,
    pressed && styles.headerPressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityLabel={t(TRANSLATION_KEYS.preBrewConstraintsTitle)}
      accessibilityHint={t(TRANSLATION_KEYS.preBrewConstraintsHint)}
    >
      <View style={styles.headerText}>
        <Text variant="cardTitle">{t(TRANSLATION_KEYS.preBrewConstraintsTitle)}</Text>
        <Text variant="caption" tone={isEmpty ? 'muted' : 'secondary'}>
          {isEmpty
            ? t(TRANSLATION_KEYS.preBrewConstraintsClosed)
            : t(TRANSLATION_KEYS.preBrewConstraintsCount, { count })}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={isOpen ? CONSTRAINTS_ICONS.expanded : CONSTRAINTS_ICONS.collapsed}
        size={theme.size.iconMedium}
        color={theme.colors.onSurfaceVariant}
      />
    </Pressable>
  );
};
