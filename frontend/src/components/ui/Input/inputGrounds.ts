import type { ColorPalette } from '../../../theme';
import type { TextTone } from '../Text';

/**
 * What a field is drawn on.
 *
 * `surface` is every form inside the app. `espresso` is the signed-out
 * screens, which are dark in both colour schemes - so a bordered white box
 * there reads as a piece of some other application dropped onto the brown.
 *
 * The two were two components until this, and the second one existed only
 * because the first could not be told what it was standing on. Everything
 * else about them was the same box.
 */
export type InputGround = 'surface' | 'espresso';

export const DEFAULT_INPUT_GROUND: InputGround = 'surface';

/**
 * The fill, which is also the resting border.
 *
 * A field at rest carries no outline in this design: it is a filled box, and
 * the ring is reserved for saying something. Drawing that ring in the fill's
 * own colour rather than leaving it off keeps the box the same size in all
 * four states - a border that appears on focus and was not there before moves
 * the text it surrounds by two points on the frame the keyboard opens.
 */
export const INPUT_FILLS = {
  surface: 'surfaceVariant',
  espresso: 'espressoDeep',
} as const satisfies Record<InputGround, keyof ColorPalette>;

/** The ring that says a keyboard is open and this is the box it types into. */
export const INPUT_FOCUS_RINGS = {
  surface: 'primary',
  espresso: 'accentOnEspresso',
} as const satisfies Record<InputGround, keyof ColorPalette>;

export const INPUT_TEXT_COLORS = {
  surface: 'onSurface',
  espresso: 'onEspresso',
} as const satisfies Record<InputGround, keyof ColorPalette>;

/**
 * What the box says before anything is typed into it.
 *
 * Quieter than the value on both grounds, and never the disabled colour on
 * the dark one: `onDisabled` is a grey mixed for a light surface, and on the
 * deep brown it is a placeholder nobody can read.
 */
export const INPUT_PLACEHOLDER_COLORS = {
  surface: 'onDisabled',
  espresso: 'onEspressoVariant',
} as const satisfies Record<InputGround, keyof ColorPalette>;

/** The small glyph beside the label, where a field names one. */
export const INPUT_LABEL_ICON_COLORS = {
  surface: 'onSurfaceVariant',
  espresso: 'onEspressoVariant',
} as const satisfies Record<InputGround, keyof ColorPalette>;

export const INPUT_LABEL_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<InputGround, TextTone>;

/** A line under the box that is neither a complaint nor a value. */
export const INPUT_HELP_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<InputGround, TextTone>;

/** The ring that marks a value the app guessed rather than one somebody typed. */
export const INPUT_UNVERIFIED_RING: keyof ColorPalette = 'tertiary';

/** The ring that marks a value the form has refused. */
export const INPUT_ERROR_RING: keyof ColorPalette = 'error';

export interface InputRingState {
  readonly ground: InputGround;
  readonly hasError: boolean;
  readonly unverified: boolean;
  readonly focused: boolean;
}

/**
 * Which of the four things the box has to say, if any.
 *
 * The order is the whole rule. An error wins over everything, because it is
 * the one the reader has to act on and a ring saying "worth a glance" over a
 * value the form has already refused would be the app hedging about its own
 * complaint. An unverified value wins over focus for the same reason in
 * miniature: a field read off a photograph in bad light is worth marking
 * while somebody is standing in it, not only before they arrive.
 */
export const resolveInputRing = ({
  ground,
  hasError,
  unverified,
  focused,
}: InputRingState): keyof ColorPalette | null => {
  if (hasError) {
    return INPUT_ERROR_RING;
  }

  if (unverified) {
    return INPUT_UNVERIFIED_RING;
  }

  return focused ? INPUT_FOCUS_RINGS[ground] : null;
};
