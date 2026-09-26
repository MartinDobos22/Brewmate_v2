import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import {
  CHIP_ELEVATIONS,
  CHIP_FILLS,
  CHIP_HEIGHTS,
  type ChipSize,
  type ChipTone,
} from './chipTones';

type ChipStyleMap = ViewStyles<'base' | 'choice' | 'unselected' | 'selected' | 'pressed'>;

/**
 * Two kinds of chip, and the difference is whether it answers anything.
 *
 * A chip that can be selected is a control, and it keeps the square-ish
 * radius the rest of this app's controls have - Material gives chips a pill
 * and Brewmate deliberately does not, because a pill here means "this is a
 * fact or a shortcut, there is nothing to choose".
 *
 * Everything else small and rounded is that second kind: an attribute printed
 * on a card, a flavour the profile has an opinion about, a shortcut to
 * writing. Those were three components with three heights and three fills
 * until they were one.
 */
export const createChipStyles = (theme: Theme): ChipStyleMap =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    choice: {
      height: theme.size.chipHeight,
      borderRadius: theme.shape.chip,
      borderWidth: theme.borderWidth.thin,
    },
    unselected: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
    },
    /**
     * A selection is the app's own accent, never the green.
     *
     * Green means one thing here - fresh, ideal, confirmed - and a roast level
     * somebody picked is not a positive state: "Neviem" painted green is the
     * app congratulating them on not knowing. It is also the one fill that
     * read as a foreign colour on the dark scheme's warm brown, because an
     * olive at that chroma belongs to no other part of this palette.
     */
    selected: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primaryContainer,
    },
    pressed: { opacity: theme.opacity.pressed },
  });

/** A chip that states something: a pill, sized and painted by what it says. */
export const chipPill = (theme: Theme, tone: ChipTone, size: ChipSize): ViewStyle => {
  const elevation = CHIP_ELEVATIONS[tone];

  return {
    height: theme.size[CHIP_HEIGHTS[size]],
    borderRadius: theme.shape.pill,
    backgroundColor: theme.colors[CHIP_FILLS[tone]],
    ...(elevation === null
      ? {}
      : { shadowColor: theme.colors.espresso, ...theme.elevation[elevation] }),
  };
};

/**
 * A control nobody may touch, drawn back rather than repainted.
 *
 * The disabled fill used to replace both the surface and the border, which on
 * a selected chip lost the one thing it was saying.
 */
export const chipDisabled = (theme: Theme): ViewStyle => ({ opacity: theme.opacity.disabled });
