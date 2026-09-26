import type { TextTone, TextVariant } from '../Text';

/**
 * What a screen's own title is painted on.
 *
 * The same two grounds `Input`, `StateMark` and `FigureRow` already take, and
 * for the same reason: half this application opens with an espresso block and
 * the other half starts straight into content, and neither scheme's roles
 * read on the other. A second component for the dark case is how three
 * screens ended up writing their own title out by hand.
 */
export type ScreenIntroGround = 'surface' | 'espresso';

export const DEFAULT_SCREEN_INTRO_GROUND: ScreenIntroGround = 'surface';

export const SCREEN_INTRO_TITLE_TONES = {
  surface: 'default',
  espresso: 'onEspresso',
} as const satisfies Record<ScreenIntroGround, TextTone>;

/**
 * The sentence under the title is smaller inside an espresso block than it is
 * on a screen that starts straight into content - 13/18 against 15/22, which
 * is what the handoff sets the home screen's greeting subtitle at.
 *
 * The block is a dense object holding the one thing a screen most wants read,
 * and the lead is there to qualify the title rather than to be read on its
 * own; on a content screen it is the instruction for everything below it.
 */
export const SCREEN_INTRO_LEAD_VARIANTS = {
  surface: 'bodyLead',
  espresso: 'bodyMuted',
} as const satisfies Record<ScreenIntroGround, TextVariant>;

export const SCREEN_INTRO_LEAD_TONES = {
  surface: 'default',
  espresso: 'onEspressoMuted',
} as const satisfies Record<ScreenIntroGround, TextTone>;

export const SCREEN_INTRO_NOTE_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<ScreenIntroGround, TextTone>;
