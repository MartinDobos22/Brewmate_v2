import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import type { InputGround, TextTone } from '../../../components/ui';
import type { ColorPalette } from '../../../theme';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * How the mark on the signed-out screens breathes.
 *
 * The only animation in the app that runs with nothing happening, and slow
 * enough to be felt rather than watched: six seconds a cycle and three per
 * cent of its own size. Anything faster reads as a spinner, which would be
 * the screen claiming to be busy while it waits for somebody to type.
 */
export const BRAND_BREATH = {
  scale: 1.03,
  durationMs: 6000,
} as const;

/**
 * The glyph beside each field's label, and on the buttons.
 *
 * A label on a dark field is set small and tracked out, which makes it quiet -
 * quiet enough that a column of two reads as one block of text. The mark is
 * what turns each back into a heading for the box under it.
 */
export const AUTH_ICONS = {
  email: 'email-outline',
  password: 'lock-outline',
  submit: 'arrow-right',
  google: 'google',
} as const satisfies Record<string, MaterialIconName>;

/** Whether the address has been confirmed yet. */
export type VerifyState = 'verified' | 'pending';

/**
 * The state as a glyph, and not only as a colour.
 *
 * The same rule the cupboard's freshness line and the grinder catalogue's
 * precision line follow: a line that relies on the difference between a green
 * and a muted grey is a line somebody cannot read, and this one is the whole
 * answer the screen came back to give.
 */
export const VERIFY_STATE_ICONS = {
  verified: 'check-circle',
  pending: 'email-sync-outline',
} as const satisfies Record<VerifyState, MaterialIconName>;

export const VERIFY_STATE_TONES = {
  verified: 'positiveOnEspresso',
  pending: 'onEspressoMuted',
} as const satisfies Record<VerifyState, TextTone>;

/**
 * The same decision as a palette key, because an icon takes a colour where a
 * `Text` takes a role - and the two halves of one line must not land on
 * different greens.
 */
export const VERIFY_STATE_ICON_COLORS = {
  verified: 'onEspressoPositive',
  pending: 'onEspressoVariant',
} as const satisfies Record<VerifyState, keyof ColorPalette>;

/** Which of the two the screen is reporting. */
export const NOTICE_KEYS = {
  verified: TRANSLATION_KEYS.authVerifiedNotice,
  pending: TRANSLATION_KEYS.authVerifyPendingNotice,
} as const satisfies Record<VerifyState, TranslationKey>;

/**
 * These screens are dark in both colour schemes, so their fields have to be
 * told what they are standing on - a bordered white box on the brown would be
 * a piece of some other application dropped onto it.
 */
export const AUTH_INPUT_GROUND: InputGround = 'espresso';
