import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import { TRANSLATION_KEYS, type TranslationKey } from '../i18n';

import { TAB_SEGMENTS, type TabSegment } from './routes';

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
