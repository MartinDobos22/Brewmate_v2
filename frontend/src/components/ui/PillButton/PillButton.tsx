import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import {
  createPillButtonStyles,
  pillAppearance,
  pillCircle,
  pillRaised,
} from './PillButton.styles';
import {
  DEFAULT_PILL_SIZE,
  DEFAULT_PILL_TONE,
  DISABLED_PILL_TONE,
  PILL_ICON_COLORS,
  PILL_ICON_SIZES,
  PILL_LABEL_TONES,
  PILL_LABEL_VARIANTS,
  type PillSize,
  type PillTone,
} from './pillButtonTones';

export interface PillButtonProps {
  readonly onPress: () => void;
  /** Absent draws a circle holding the glyph, which then needs `spokenLabel`. */
  readonly label?: string;
  readonly icon?: TileGlyph;
  readonly tone?: PillTone;
  readonly size?: PillSize;
  /** Takes the row it is in, for a pair of buttons sharing one. */
  readonly grows?: boolean;
  /** Takes the width of the column it is stacked in - one button under a form. */
  readonly fullWidth?: boolean;
  /** The deeper shadow, for the one button on a screen that is a commitment. */
  readonly raised?: boolean;
  /** Replaces the glyph with a spinner and refuses further presses. */
  readonly isPending?: boolean;
  readonly disabled?: boolean;
  /**
   * What the button is called out loud, where the printed label is shorter
   * than the act or absent altogether.
   *
   * Two pills side by side leave room for a word, and a circle leaves room for
   * none - "Galéria" is enough to recognise and not enough to be told.
   */
  readonly spokenLabel?: string;
}

/**
 * Every button in this app that is shaped like a pill: the commitment at the
 * bottom of a screen, the pair of answers under a question, the round control
 * in a row.
 *
 * One component rather than one per screen, because a pill is one object. The
 * screens had grown fifteen of these, each with its own pressed-state closure
 * and its own height - and six of those heights were within four points of
 * each other, which is a difference no reader can see and every screen had to
 * re-decide.
 *
 * What a caller picks is what the button *is*: how loud, how big, and whether
 * it takes the row. Everything else - the fill, the text colour, the glyph's
 * colour and size, the shadow - follows from those, so a new button cannot
 * arrive in a colour the app does not have.
 */
export const PillButton = ({
  onPress,
  label,
  icon,
  tone = DEFAULT_PILL_TONE,
  size = DEFAULT_PILL_SIZE,
  grows = false,
  fullWidth = false,
  raised = false,
  isPending = false,
  disabled = false,
  spokenLabel,
}: PillButtonProps): JSX.Element => {
  const styles = useThemedStyles(createPillButtonStyles);
  const theme = useTheme();
  const isBlocked = disabled || isPending;
  /**
   * A control with nothing to do yet is `faint`, not its own tone at 38%.
   *
   * That is what `faint` was built for, and what the chat composer's send
   * button already does over an empty box. An espresso pill dimmed to 38% on
   * a light foot bar is a ghost of a button - the fill washes out, the label
   * washes out with it, and the one thing the screen most wants pressed
   * becomes the hardest thing on it to read.
   *
   * Pending keeps its own tone and its own fill. It used to drop to 38% as
   * well, which on the foot bar's espresso pill read as a button whose
   * background had fallen off mid-request - and the spinner turning on it
   * beside a label that says "Píšem recept..." is already the whole signal.
   * Dimming it on top of that says "broken" where the two together say
   * "working".
   */
  const shown = disabled && !isPending ? DISABLED_PILL_TONE : tone;
  const iconColor = theme.colors[PILL_ICON_COLORS[shown]];

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    pillAppearance(theme, shown, size),
    label === undefined && pillCircle(theme, size),
    raised && !disabled && pillRaised(theme),
    grows && styles.grows,
    fullWidth && styles.fullWidth,
    pressed && !isBlocked && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={isBlocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked, busy: isPending }}
      accessibilityLabel={spokenLabel ?? label}
    >
      {isPending ? <ActivityIndicator color={iconColor} /> : null}
      {!isPending && icon !== undefined ? (
        <MaterialCommunityIcons
          name={icon}
          size={theme.size[PILL_ICON_SIZES[size]]}
          color={iconColor}
        />
      ) : null}
      {label === undefined ? null : (
        <Text variant={PILL_LABEL_VARIANTS[size]} tone={PILL_LABEL_TONES[shown]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};
