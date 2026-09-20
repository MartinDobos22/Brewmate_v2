import type { TileGlyph } from '../../../components/ui';

/**
 * The marks in the profile's own header.
 *
 * Whether an address has been verified is a mark beside it rather than a
 * sentence under it: it is one bit about the address, not a second fact about
 * the person.
 */
export const PROFILE_HEADER_ICONS = {
  account: 'account',
  verified: 'check-decagram',
  unverified: 'email-alert-outline',
  gear: 'cog-outline',
} as const satisfies Record<string, TileGlyph>;

/** The two ways to disagree with the profile, and the mark over both of them. */
export const CORRECTION_ICONS = {
  heading: 'tune-variant',
  questionnaire: 'clipboard-text-outline',
  manual: 'tune',
} as const satisfies Record<string, TileGlyph>;

/** The two answers that are a choice rather than a position on a scale. */
export const PREFERENCE_ICONS = {
  roast: 'fire',
  milk: 'cup',
} as const satisfies Record<string, TileGlyph>;
