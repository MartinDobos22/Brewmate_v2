import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The steps of the flow, in order.
 *
 * These strings are written into `users.onboarding_state`, so they are an
 * identity rather than a label: renaming one strands everybody who is halfway
 * through. Reordering or replacing them is what `ONBOARDING_FLOW_VERSION` is
 * for.
 */
export const ONBOARDING_STEPS = {
  welcome: 'welcome',
  taste: 'taste',
  grinder: 'grinder',
  brewers: 'brewers',
  gear: 'gear',
  water: 'water',
  sets: 'sets',
  calibration: 'calibration',
  done: 'done',
} as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

export const ONBOARDING_STEP_ORDER: readonly OnboardingStep[] = [
  ONBOARDING_STEPS.welcome,
  ONBOARDING_STEPS.taste,
  ONBOARDING_STEPS.grinder,
  ONBOARDING_STEPS.brewers,
  ONBOARDING_STEPS.gear,
  ONBOARDING_STEPS.water,
  ONBOARDING_STEPS.sets,
  ONBOARDING_STEPS.calibration,
  ONBOARDING_STEPS.done,
];

/**
 * The steps the progress bar counts. The welcome and the closing screen are
 * not work the user has to get through, and counting them would make the bar
 * jump to a fifth full before a single question was asked.
 */
export const ONBOARDING_PROGRESS_STEPS = [
  ONBOARDING_STEPS.taste,
  ONBOARDING_STEPS.grinder,
  ONBOARDING_STEPS.brewers,
  ONBOARDING_STEPS.gear,
  ONBOARDING_STEPS.water,
  ONBOARDING_STEPS.sets,
  ONBOARDING_STEPS.calibration,
] as const;

export type OnboardingProgressStep = (typeof ONBOARDING_PROGRESS_STEPS)[number];

export const ONBOARDING_STEP_LABEL_KEYS: Record<OnboardingProgressStep, TranslationKey> = {
  [ONBOARDING_STEPS.taste]: TRANSLATION_KEYS.onboardingStepTaste,
  [ONBOARDING_STEPS.grinder]: TRANSLATION_KEYS.onboardingStepGrinder,
  [ONBOARDING_STEPS.brewers]: TRANSLATION_KEYS.onboardingStepBrewers,
  [ONBOARDING_STEPS.gear]: TRANSLATION_KEYS.onboardingStepGear,
  [ONBOARDING_STEPS.water]: TRANSLATION_KEYS.onboardingStepWater,
  [ONBOARDING_STEPS.sets]: TRANSLATION_KEYS.onboardingStepSets,
  [ONBOARDING_STEPS.calibration]: TRANSLATION_KEYS.onboardingStepCalibration,
};

/**
 * Bumped whenever the steps or the questions change.
 *
 * A stored state from an older version is started over rather than resumed:
 * "you were on step five" means nothing once step five is a different screen.
 */
export const ONBOARDING_FLOW_VERSION = 2;

/** The route parameter that opens one step on its own, from the profile screen. */
export const ONBOARDING_STEP_PARAM = 'step';

/** How the onboarding route appears in `useSegments`, so a gate can tell it apart. */
export const ONBOARDING_ROUTE_SEGMENT = 'onboarding';
