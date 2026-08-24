import {
  DIAL_IN_CHANGES,
  DIAL_IN_DIRECTIONS,
  SHOT_TRENDS,
  type DialInChange,
  type DialInDirection,
  type ShotTrend,
} from '@brewmate/shared';

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
