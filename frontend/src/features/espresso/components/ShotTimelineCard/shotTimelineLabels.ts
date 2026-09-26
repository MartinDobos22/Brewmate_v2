import {
  DIAL_IN_CHANGES,
  DIAL_IN_DIRECTIONS,
  SHOT_TRENDS,
  type DialInChange,
  type DialInDirection,
  type ShotTrend,
} from '@brewmate/shared';

import type { TextTone, TileGlyph } from '../../../../components/ui';
import type { ColorPalette } from '../../../../theme';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../../i18n';

/**
 * Every machine name the timeline can carry, in Slovak.
 *
 * Total maps, so adding a direction or a trend to the contract is a type error
 * here rather than an English identifier printed on somebody's chart.
 */
export const DIAL_IN_CHANGE_KEYS: Record<DialInChange, TranslationKey> = {
  [DIAL_IN_CHANGES.grind]: TRANSLATION_KEYS.dialInChangeGrind,
  [DIAL_IN_CHANGES.dose]: TRANSLATION_KEYS.dialInChangeDose,
  [DIAL_IN_CHANGES.none]: TRANSLATION_KEYS.dialInChangeNone,
};

export const DIAL_IN_DIRECTION_KEYS: Record<DialInDirection, TranslationKey> = {
  [DIAL_IN_DIRECTIONS.finer]: TRANSLATION_KEYS.dialInDirectionFiner,
  [DIAL_IN_DIRECTIONS.coarser]: TRANSLATION_KEYS.dialInDirectionCoarser,
  [DIAL_IN_DIRECTIONS.more]: TRANSLATION_KEYS.dialInDirectionMore,
  [DIAL_IN_DIRECTIONS.less]: TRANSLATION_KEYS.dialInDirectionLess,
};

export const SHOT_TREND_KEYS: Record<ShotTrend, TranslationKey> = {
  [SHOT_TRENDS.closer]: TRANSLATION_KEYS.dialInTrendCloser,
  [SHOT_TRENDS.further]: TRANSLATION_KEYS.dialInTrendFurther,
  [SHOT_TRENDS.steady]: TRANSLATION_KEYS.dialInTrendSteady,
};

/**
 * Whether the shot came closer to the target window, as a glyph.
 *
 * This is the one fact a dial-in is about - the whole run is the argument
 * between what was changed and whether it worked - and it was carried by the
 * difference between an ochre and a grey. An arrow says it: towards the
 * target, away from it, or nowhere.
 */
export const SHOT_TREND_ICONS = {
  [SHOT_TRENDS.closer]: 'arrow-down-right',
  [SHOT_TRENDS.further]: 'arrow-up-right',
  [SHOT_TRENDS.steady]: 'arrow-right',
} as const satisfies Record<ShotTrend, TileGlyph>;

/**
 * Only a shot that went the wrong way is painted. Coming closer is what is
 * supposed to happen, and an interface that congratulates itself on every
 * step is one nobody reads by the fourth.
 */
export const SHOT_TREND_TONES = {
  [SHOT_TRENDS.closer]: 'secondary',
  [SHOT_TRENDS.further]: 'tertiary',
  [SHOT_TRENDS.steady]: 'muted',
} as const satisfies Record<ShotTrend, TextTone>;

export const SHOT_TREND_ICON_COLORS = {
  [SHOT_TRENDS.closer]: 'secondary',
  [SHOT_TRENDS.further]: 'tertiary',
  [SHOT_TRENDS.steady]: 'onSurfaceVariant',
} as const satisfies Record<ShotTrend, keyof ColorPalette>;
