import {
  FLAVOR_AFFINITY_MIN,
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  TASTE_AXIS_NEUTRAL,
  resolveConfidenceLevel,
  type FlavorAffinities,
  type TasteProfile,
} from '@brewmate/shared';

import {
  PROMPT_AXIS_DECIMALS,
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NEUTRAL_AFFINITY = 0;
const NOTHING = 0;
const NO_PREFERENCE = 'no preference recorded';
const NONE_KNOWN = 'nothing recorded yet';

/** What each end of an axis means, so a bare number is not read as a rating. */
const AXIS_MEANINGS = {
  acidity: 'prefers flat, low-acid cups at the bottom; bright, juicy, fruit-acid cups at the top',
  sweetness: 'indifferent to sweetness at the bottom; wants an obviously sweet cup at the top',
  body: 'prefers a light, tea-like cup at the bottom; a heavy, syrupy one at the top',
  bitterness: 'avoids bitterness at the bottom; welcomes a dark, bitter edge at the top',
  intensity: 'prefers a mild, dilute cup at the bottom; a strong, concentrated one at the top',
} as const;

const axisLine = (name: keyof typeof AXIS_MEANINGS, value: number): string =>
  [
    PROMPT_BULLET,
    name,
    PROMPT_LABEL_SEPARATOR,
    value.toFixed(PROMPT_AXIS_DECIMALS),
    ` (${AXIS_MEANINGS[name]})`,
  ].join('');

const affinities = (all: FlavorAffinities, wanted: boolean): string => {
  const tags = Object.entries(all)
    .filter(([, score]: readonly [string, number]): boolean =>
      wanted ? score > NEUTRAL_AFFINITY : score < NEUTRAL_AFFINITY,
    )
    .map(([tag]: readonly [string, number]): string => tag);

  return tags.length === NOTHING ? NONE_KNOWN : tags.join(PROMPT_LIST_SEPARATOR);
};

/**
 * The person, as a list of facts, with the scale spelled out beside them.
 *
 * The axes are handed over as numbers with their ends explained rather than as
 * adjectives, because the adjective is the thing being asked for: a model told
 * "body 7.8" and what 0 and 10 mean writes a sentence about a heavier cup; one
 * told "medium-high body" mostly writes "medium-high body" back.
 *
 * The confidence band is stated in the same words the app prints on the screen
 * beside the verdict, so the caveat in the text and the caveat under it cannot
 * contradict each other.
 */
export const describeTasteProfile = (profile: TasteProfile): string =>
  [
    `What Brewmate knows about this person (axes run from ${String(TASTE_AXIS_MIN)} to ${String(TASTE_AXIS_MAX)}, ${String(TASTE_AXIS_NEUTRAL)} is neutral):`,
    axisLine('acidity', profile.acidity),
    axisLine('sweetness', profile.sweetness),
    axisLine('body', profile.body),
    axisLine('bitterness', profile.bitterness),
    axisLine('intensity', profile.intensity),
    `${PROMPT_BULLET}flavours they like${PROMPT_LABEL_SEPARATOR}${affinities(profile.flavorAffinities, true)}`,
    `${PROMPT_BULLET}flavours they dislike (down to ${String(FLAVOR_AFFINITY_MIN)})${PROMPT_LABEL_SEPARATOR}${affinities(profile.flavorAffinities, false)}`,
    `${PROMPT_BULLET}preferred roast level${PROMPT_LABEL_SEPARATOR}${profile.roastPreference ?? NO_PREFERENCE}`,
    `${PROMPT_BULLET}milk${PROMPT_LABEL_SEPARATOR}${profile.milkUsage ?? NO_PREFERENCE}`,
    `${PROMPT_BULLET}confidence band${PROMPT_LABEL_SEPARATOR}${resolveConfidenceLevel(profile.confidenceLevel)}`,
    `${PROMPT_BULLET}brews logged so far${PROMPT_LABEL_SEPARATOR}${String(profile.brewCount)}`,
  ].join(PROMPT_LINE_SEPARATOR);
