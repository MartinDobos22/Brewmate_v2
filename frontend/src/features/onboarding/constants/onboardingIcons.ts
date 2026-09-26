import type { TileGlyph } from '../../../components/ui';

import { ONBOARDING_STEPS, type OnboardingProgressStep } from './onboardingSteps';

/** The way back and the way out. */
export const ONBOARDING_HEADER_ICONS = {
  back: 'chevron-left',
  leave: 'close',
} as const satisfies Record<string, TileGlyph>;

/**
 * A mark per step, beside its name above the bar.
 *
 * The name of the step is set small and tracked out so it does not compete
 * with the question under it, which makes it quiet enough to be skipped. The
 * glyph is what turns that line back into a place: "Chuť" read past is a word,
 * and a cup beside it is where you are.
 */
export const ONBOARDING_STEP_ICONS = {
  [ONBOARDING_STEPS.taste]: 'tea-outline',
  [ONBOARDING_STEPS.grinder]: 'grain',
  [ONBOARDING_STEPS.brewers]: 'filter-outline',
  [ONBOARDING_STEPS.gear]: 'toolbox-outline',
  [ONBOARDING_STEPS.water]: 'water-outline',
  [ONBOARDING_STEPS.sets]: 'home-outline',
  [ONBOARDING_STEPS.calibration]: 'coffee-outline',
} as const satisfies Record<OnboardingProgressStep, TileGlyph>;
