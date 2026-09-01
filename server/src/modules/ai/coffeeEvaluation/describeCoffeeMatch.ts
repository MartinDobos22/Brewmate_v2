import { MATCH_BANDS, MATCH_DIRECTIONS, type AxisMatch, type CoffeeMatch } from '@brewmate/shared';

import {
  PROMPT_AXIS_DECIMALS,
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;

/** What each direction means for the person, spelled out so it cannot be read backwards. */
const DIRECTION_MEANINGS: Record<string, string> = {
  [MATCH_DIRECTIONS.above]: 'the coffee has MORE of this than they reach for',
  [MATCH_DIRECTIONS.below]: 'the coffee has LESS of this than they reach for',
  [MATCH_DIRECTIONS.aligned]: 'the coffee sits where they like it',
};

const BAND_MEANINGS: Record<string, string> = {
  [MATCH_BANDS.match]: 'on the axes that could be compared, this coffee suits them',
  [MATCH_BANDS.mixed]:
    'some of this coffee suits them and some of it does not - say both, do not pick a side',
  [MATCH_BANDS.mismatch]: 'on the axes that could be compared, this coffee is not what they go for',
  [MATCH_BANDS.unknown]:
    'too little is known about this person, this coffee, or both, for any taste comparison at all',
};

const NO_COMPARISON =
  'No axis of this coffee could be compared with this person: either they have said nothing about those axes or the label did not speak to them. Do not compare the two. Argue only from what is true of the coffee for anybody, and say plainly that you cannot judge the fit yet.';

const axisLine = (match: AxisMatch): string =>
  [
    PROMPT_BULLET,
    match.axis,
    PROMPT_LABEL_SEPARATOR,
    `coffee ${match.coffeeValue.toFixed(PROMPT_AXIS_DECIMALS)}, they prefer ${match.profileValue.toFixed(PROMPT_AXIS_DECIMALS)}`,
    ` - ${DIRECTION_MEANINGS[match.direction] ?? ''}`,
  ].join('');

/**
 * The comparison, already made, handed over as facts.
 *
 * This is the difference between a model that argues and a model that guesses.
 * Given two lists of numbers - the person's five axes and the coffee's label -
 * a model does the comparison in its head, silently, with no way for anybody
 * to check which axes it actually weighed or whether it compared one nobody
 * has any evidence about. Given the comparison already made, it does the thing
 * it is genuinely good at: turning three computed facts into two sentences a
 * person will act on.
 *
 * Only the comparable axes are listed, in the order they argue strongest, and
 * the prompt is told not to reach past them. An axis missing from this list is
 * missing because either the person or the label said nothing about it, and a
 * reason built on that is an invented reason - which in front of a shelf is
 * worse than no reason at all.
 *
 * The values travel as numbers with their meaning spelled out beside them
 * rather than as adjectives, for the same reason the profile does: the
 * adjective is the thing being asked for.
 */
export const describeCoffeeMatch = (match: CoffeeMatch): string => {
  if (match.comparable.length === NOTHING || match.band === MATCH_BANDS.unknown) {
    return NO_COMPARISON;
  }

  return [
    'How this coffee compares with this person, already worked out for you. The axes below are the only ones where both what they want and what the coffee is are actually known - argue from these and from nothing else:',
    ...match.comparable.map(axisLine),
    `${PROMPT_BULLET}overall${PROMPT_LABEL_SEPARATOR}${BAND_MEANINGS[match.band] ?? ''}`,
    'The axes are ordered by how much they matter here. Lead with the first one. Any axis not listed above could not be compared, so do not mention how it fits - you may still state it as a fact about the coffee.',
  ].join(PROMPT_LINE_SEPARATOR);
};
