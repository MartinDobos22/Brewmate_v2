import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { ColorPalette, Theme, ViewStyles } from '../../../theme';

import { INPUT_FILLS, INPUT_TEXT_COLORS, type InputGround } from './inputGrounds';

type InputStyleMap = ViewStyles<'wrapper' | 'label' | 'reveal'>;

/**
 * A filled box with the ring kept back for when there is something to say.
 *
 * The outlined field this replaced drew a border in every state, which left
 * the design nothing to do with one: focus, an error and a value read off a
 * photograph in bad light were the same rectangle in three colours, two of
 * which are only distinguishable side by side. A box that is filled at rest
 * can put a ring round itself and be understood immediately.
 */
export const createInputStyles = (theme: Theme): InputStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    /**
     * The label is set small and tracked out, so it carries its glyph on the
     * same line: two quiet rows stacked read as one block of small text
     * rather than as a heading over a field.
     */
    label: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    reveal: { padding: theme.spacing.xs },
  });

/**
 * What makes a box a field: the fill, the radius and the ring.
 *
 * Exported because a closed dropdown is a field holding one answer and has to
 * be built to the same metrics - two places deciding separately what a field
 * looks like is two fields on the brewing screen that disagree. The height is
 * deliberately not here: a dropdown grows for a second line and a text field
 * does not.
 *
 * The ring is drawn in the fill's own colour when there is nothing to say,
 * rather than left off: a border that appears on focus and was not there
 * before moves the value it surrounds by two points on the frame the keyboard
 * opens.
 */
export const fieldSurface = (
  theme: Theme,
  ground: InputGround,
  ring: keyof ColorPalette | null,
): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.shape.input,
  borderWidth: theme.borderWidth.thick,
  borderColor: theme.colors[ring ?? INPUT_FILLS[ground]],
  backgroundColor: theme.colors[INPUT_FILLS[ground]],
});

/**
 * That surface at the one height every text field in the app shares.
 *
 * A multiline box takes the same height as a floor rather than as a fixed
 * height, so it starts where every other field starts and grows with what is
 * typed into it. Fixed, it sliced the second line of its own placeholder in
 * half on the one screen that is handed a pasted paragraph.
 */
export const inputBox = (
  theme: Theme,
  ground: InputGround,
  ring: keyof ColorPalette | null,
  multiline = false,
): ViewStyle => ({
  ...fieldSurface(theme, ground, ring),
  ...(multiline
    ? { minHeight: theme.size.inputHeight, paddingVertical: theme.spacing.md }
    : { height: theme.size.inputHeight }),
  opacity: theme.opacity.full,
});

/** A field nobody may type into: the whole box drops back, ring and all. */
export const inputDisabled = (theme: Theme): ViewStyle => ({ opacity: theme.opacity.disabled });

/**
 * The value, whose colour is the one thing about the text that follows the
 * ground rather than the type scale.
 */
export const inputText = (theme: Theme, ground: InputGround, multiline = false): TextStyle => ({
  flex: 1,
  minWidth: 0,
  ...(multiline ? { textAlignVertical: 'top' } : {}),
  ...theme.typography.bodyAnswer,
  color: theme.colors[INPUT_TEXT_COLORS[ground]],
  /**
   * Zeroed rather than left to the platform: Android gives a bare `TextInput`
   * vertical padding of its own, which inside a box of a fixed height pushes
   * the value off centre on one platform and not the other.
   */
  padding: theme.spacing.none,
});
