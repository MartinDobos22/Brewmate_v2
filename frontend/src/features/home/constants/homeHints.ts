import type { TileGlyph } from '../../../components/ui';
import { ROUTES, type Route } from '../../../constants/routes';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

import { HOME_TILE_ICONS } from './homeTiles';

/**
 * The one thing the home screen has to say today.
 *
 * Every hint either names something about this account that is true right now,
 * or - when there is nothing to report - teaches one thing about brewing. The
 * order they are checked in is the order they matter: what is wrong with the
 * coffee on the shelf beats a general tip, and not knowing the drinker at all
 * beats both.
 */
export const HOME_HINT_IDS = {
  taste: 'taste',
  noCoffee: 'noCoffee',
  aging: 'aging',
  resting: 'resting',
  firstBrew: 'firstBrew',
  idle: 'idle',
  ready: 'ready',
  tipGrind: 'tipGrind',
  tipWater: 'tipWater',
  tipBloom: 'tipBloom',
  tipSour: 'tipSour',
  tipDescribe: 'tipDescribe',
  tipScale: 'tipScale',
} as const;

export type HomeHintId = (typeof HOME_HINT_IDS)[keyof typeof HOME_HINT_IDS];

export interface HomeHintPresentation {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
  readonly icon: TileGlyph;
  /**
   * Where the hint leads, or null when it is only worth knowing.
   *
   * A tip about grind size has nowhere useful to send anybody, and a card that
   * invented a destination for it would be sending people somewhere to be
   * disappointed.
   */
  readonly route: Route | null;
}

export const HOME_HINTS: Record<HomeHintId, HomeHintPresentation> = {
  [HOME_HINT_IDS.taste]: {
    titleKey: TRANSLATION_KEYS.homeHintTasteTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTasteBody,
    icon: HOME_TILE_ICONS.taste,
    route: ROUTES.onboarding,
  },
  [HOME_HINT_IDS.noCoffee]: {
    titleKey: TRANSLATION_KEYS.homeHintNoCoffeeTitle,
    bodyKey: TRANSLATION_KEYS.homeHintNoCoffeeBody,
    icon: HOME_TILE_ICONS.inventory,
    route: ROUTES.inventory,
  },
  [HOME_HINT_IDS.aging]: {
    titleKey: TRANSLATION_KEYS.homeHintAgingTitle,
    bodyKey: TRANSLATION_KEYS.homeHintAgingBody,
    icon: HOME_TILE_ICONS.inventory,
    route: ROUTES.brew,
  },
  [HOME_HINT_IDS.resting]: {
    titleKey: TRANSLATION_KEYS.homeHintRestingTitle,
    bodyKey: TRANSLATION_KEYS.homeHintRestingBody,
    icon: HOME_TILE_ICONS.inventory,
    route: ROUTES.inventory,
  },
  [HOME_HINT_IDS.ready]: {
    titleKey: TRANSLATION_KEYS.homeHintReadyTitle,
    bodyKey: TRANSLATION_KEYS.homeHintReadyBody,
    icon: HOME_TILE_ICONS.brew,
    route: ROUTES.brew,
  },
  [HOME_HINT_IDS.firstBrew]: {
    titleKey: TRANSLATION_KEYS.homeHintFirstBrewTitle,
    bodyKey: TRANSLATION_KEYS.homeHintFirstBrewBody,
    icon: HOME_TILE_ICONS.quickBrew,
    route: ROUTES.quickBrew,
  },
  [HOME_HINT_IDS.idle]: {
    titleKey: TRANSLATION_KEYS.homeHintIdleTitle,
    bodyKey: TRANSLATION_KEYS.homeHintIdleBody,
    icon: HOME_TILE_ICONS.brew,
    route: ROUTES.brew,
  },
  [HOME_HINT_IDS.tipGrind]: {
    titleKey: TRANSLATION_KEYS.homeHintTipGrindTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipGrindBody,
    icon: HOME_TILE_ICONS.hint,
    route: null,
  },
  [HOME_HINT_IDS.tipWater]: {
    titleKey: TRANSLATION_KEYS.homeHintTipWaterTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipWaterBody,
    icon: HOME_TILE_ICONS.hint,
    route: null,
  },
  [HOME_HINT_IDS.tipBloom]: {
    titleKey: TRANSLATION_KEYS.homeHintTipBloomTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipBloomBody,
    icon: HOME_TILE_ICONS.hint,
    route: null,
  },
  [HOME_HINT_IDS.tipSour]: {
    titleKey: TRANSLATION_KEYS.homeHintTipSourTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipSourBody,
    icon: HOME_TILE_ICONS.hint,
    route: null,
  },
  [HOME_HINT_IDS.tipDescribe]: {
    titleKey: TRANSLATION_KEYS.homeHintTipDescribeTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipDescribeBody,
    icon: HOME_TILE_ICONS.hint,
    route: ROUTES.quickBrew,
  },
  [HOME_HINT_IDS.tipScale]: {
    titleKey: TRANSLATION_KEYS.homeHintTipScaleTitle,
    bodyKey: TRANSLATION_KEYS.homeHintTipScaleBody,
    icon: HOME_TILE_ICONS.hint,
    route: null,
  },
};

/**
 * The tips, in the order they rotate.
 *
 * Picked by the calendar day rather than at random: a card that changed every
 * time the screen was scrolled past would be one nobody ever finishes reading,
 * and one that changed on every launch would never be believed twice.
 */
export const HOME_HINT_TIPS: readonly HomeHintId[] = [
  HOME_HINT_IDS.tipGrind,
  HOME_HINT_IDS.tipWater,
  HOME_HINT_IDS.tipBloom,
  HOME_HINT_IDS.tipSour,
  HOME_HINT_IDS.tipDescribe,
  HOME_HINT_IDS.tipScale,
];
