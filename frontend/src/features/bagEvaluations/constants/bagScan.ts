import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * What somebody came here to do.
 *
 * Two modes over one parsing layer: the label is read the same way either
 * way, and only what happens afterwards differs - an opinion, or a row in the
 * cupboard. Asking first is cheaper than guessing, and the two answers lead to
 * genuinely different screens.
 */
export const BAG_SCAN_MODES = {
  verdict: 'verdict',
  inventory: 'inventory',
} as const;

export type BagScanMode = (typeof BAG_SCAN_MODES)[keyof typeof BAG_SCAN_MODES];

/** Where somebody is inside one scan. */
export const BAG_SCAN_STAGES = {
  mode: 'mode',
  capture: 'capture',
  label: 'label',
  verdict: 'verdict',
  done: 'done',
} as const;

export type BagScanStage = (typeof BAG_SCAN_STAGES)[keyof typeof BAG_SCAN_STAGES];

/**
 * How the verdict comes out.
 *
 * `unknown` is a real answer, not a failure: a shelf full of bags and an app
 * that knows nothing about the person in front of it is exactly the situation
 * where a confident recommendation would be made up.
 */
export const BAG_VERDICT_LEVELS = {
  fits: 'fits',
  mixed: 'mixed',
  unknown: 'unknown',
} as const;

export type BagVerdictLevel = (typeof BAG_VERDICT_LEVELS)[keyof typeof BAG_VERDICT_LEVELS];

/** The headline each verdict carries, and the sentence under it. */
export const BAG_VERDICT_TITLE_KEYS: Record<BagVerdictLevel, TranslationKey> = {
  [BAG_VERDICT_LEVELS.fits]: TRANSLATION_KEYS.scanVerdictFits,
  [BAG_VERDICT_LEVELS.mixed]: TRANSLATION_KEYS.scanVerdictMixed,
  [BAG_VERDICT_LEVELS.unknown]: TRANSLATION_KEYS.scanVerdictUnknown,
};

export const BAG_VERDICT_BODY_KEYS: Record<BagVerdictLevel, TranslationKey> = {
  [BAG_VERDICT_LEVELS.fits]: TRANSLATION_KEYS.scanVerdictFitsBody,
  [BAG_VERDICT_LEVELS.mixed]: TRANSLATION_KEYS.scanVerdictMixedBody,
  [BAG_VERDICT_LEVELS.unknown]: TRANSLATION_KEYS.scanVerdictUnknownBody,
};

/** The parts of a label a verdict can be missing, as stored uncertainties. */
export const BAG_SCAN_FIELDS = {
  roastLevel: 'roastLevel',
  tastingNotes: 'tastingNotes',
  roastDate: 'roastDate',
  tasteProfile: 'tasteProfile',
} as const;

/**
 * How far apart two roast levels may be before they stop being the same
 * answer. One step - a medium next to a medium-light - is a difference nobody
 * would notice on a shelf, let alone across roasters.
 */
export const ROAST_LEVEL_NEAR_DISTANCE = 1;
