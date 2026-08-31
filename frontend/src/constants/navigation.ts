import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import { TRANSLATION_KEYS, type TranslationKey } from '../i18n';

import { AUTH_GROUP_SEGMENT, TAB_SEGMENTS, type TabSegment } from './routes';

/** Route segments named here rather than at the two places that compare them. */
const TABS_GROUP_SEGMENT = '(tabs)';
const ONBOARDING_SEGMENT = 'onboarding';
const VERIFY_EMAIL_SEGMENT = 'verify-email';
const BREW_MODE_SEGMENT = 'brew-mode';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Screen transition names, as react-navigation spells them. */
export const SCREEN_ANIMATIONS = {
  none: 'none',
  slide: 'slide_from_right',
  modal: 'slide_from_bottom',
} as const;

export const SCREEN_PRESENTATIONS = {
  card: 'card',
  modal: 'modal',
} as const;

/** MaterialCommunityIcons glyph names, one per tab. */
export const TAB_ICONS: Record<TabSegment, GlyphName> = {
  [TAB_SEGMENTS.home]: 'home-variant-outline',
  [TAB_SEGMENTS.inventory]: 'package-variant-closed',
  [TAB_SEGMENTS.brew]: 'coffee-outline',
  [TAB_SEGMENTS.profile]: 'account-outline',
};

/**
 * The first route segments that do not get the shared bottom bar.
 *
 * Four, and each for its own reason. `(tabs)` already has one - the navigator
 * draws it, and a second would be two bars. `(auth)` and `onboarding` are
 * linear: there is nowhere else to be yet, and four destinations under a
 * sign-in form are four ways to abandon it. `verify-email` is the same
 * situation one step later. `brew-mode` is the deliberate one: it is used at
 * arm's length with wet hands over a running timer, and a row of destinations
 * along the bottom edge is exactly where a thumb lands when somebody picks the
 * phone up mid-pour.
 *
 * Everything else gets the bar, including the screens that are dead ends
 * without it.
 */
export const BOTTOM_BAR_HIDDEN_SEGMENTS: readonly string[] = [
  TABS_GROUP_SEGMENT,
  AUTH_GROUP_SEGMENT,
  ONBOARDING_SEGMENT,
  VERIFY_EMAIL_SEGMENT,
  BREW_MODE_SEGMENT,
];

/** Android status and navigation bar styles. */
export const BAR_STYLES = {
  light: 'light',
  dark: 'dark',
} as const;

/** The i18n key holding each tab's label. */
export const TAB_LABEL_KEYS: Record<TabSegment, TranslationKey> = {
  [TAB_SEGMENTS.home]: TRANSLATION_KEYS.tabHome,
  [TAB_SEGMENTS.inventory]: TRANSLATION_KEYS.tabInventory,
  [TAB_SEGMENTS.brew]: TRANSLATION_KEYS.tabBrew,
  [TAB_SEGMENTS.profile]: TRANSLATION_KEYS.tabProfile,
};
