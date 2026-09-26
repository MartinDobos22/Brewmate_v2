import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX, ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createOptionCardStyles } from './OptionCard.styles';
import { OPTION_CHOSEN_ICON } from './optionCardIcon';

export interface OptionCardProps {
  readonly label: string;
  /** One short line under the label, for an option that needs explaining. */
  readonly note?: string;
  readonly onPress: () => void;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  /**
   * A glyph on the left, for a list of things rather than a list of answers.
   *
   * Optional because the questionnaire has no use for one: "milk chocolate" is
   * not a thing with a picture, and inventing one would be decoration. A
   * brewer is, and a column of brewers is read by shape long before it is read
   * by name.
   */
  readonly icon?: TileGlyph;
  /** Sits at the right edge - a weight, a state, a freshness. */
  readonly trailing?: ReactNode;
}

/**
 * A large, single-tap answer: the questionnaire, the water types, the gear.
 *
 * The chosen card draws its own mark rather than taking one through
 * `trailing`. Being answered is what `selected` means, and a card that
 * depended on its caller to say so would eventually be used somewhere that
 * forgot - on the one screen in the app where the only thing a person does is
 * choose.
 */
export const OptionCard = ({
  label,
  note,
  onPress,
  selected = false,
  disabled = false,
  icon,
  trailing,
}: OptionCardProps): JSX.Element => {
  const styles = useThemedStyles(createOptionCardStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    selected ? styles.selected : styles.unselected,
    pressed && !disabled && styles.pressed,
    disabled && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.row}>
        {icon === undefined ? null : (
          <View style={[styles.badge, selected && styles.badgeSelected]}>
            <MaterialCommunityIcons
              name={icon}
              size={theme.size.iconLarge}
              color={selected ? theme.colors.accentOnEspresso : theme.colors.onSurfaceVariant}
            />
          </View>
        )}
        <View style={styles.content}>
          <Text variant="cardTitle" tone={selected ? 'onEspresso' : 'default'}>
            {label}
          </Text>
          {note === undefined ? null : (
            <Text variant="caption" tone={selected ? 'onEspressoMuted' : 'muted'}>
              {note}
            </Text>
          )}
        </View>
        {trailing === undefined ? null : <View style={styles.trailing}>{trailing}</View>}
        {selected ? (
          <MaterialCommunityIcons
            name={OPTION_CHOSEN_ICON}
            size={theme.size.iconLarge}
            color={theme.colors.onEspressoPositive}
          />
        ) : null}
      </View>
    </Pressable>
  );
};
