import type { TasteAxes, TasteAxisName } from '../tasteProfiles/tasteAxesSchema.js';
import type { TasteAxisConfidence } from '../tasteProfiles/tasteAxisConfidenceSchema.js';

/**
 * Which way a coffee misses, said as a machine name.
 *
 * Direction rather than a signed number, because every sentence the app writes
 * about this needs to know which side it is on - "kyslejšia, než máš rád" and
 * "menej kyslá, než máš rád" are different advice - and reading that off the
 * sign of a float at each call site is how one of them eventually comes out
 * backwards.
 */
export const MATCH_DIRECTIONS = {
  aligned: 'aligned',
  /** The coffee has more of this axis than the person reaches for. */
  above: 'above',
  below: 'below',
} as const;

export type MatchDirection = (typeof MATCH_DIRECTIONS)[keyof typeof MATCH_DIRECTIONS];

/**
 * How the whole comparison came out.
 *
 * Four states, and `unknown` is a first-class one rather than a failure: this
 * is the screen a brand-new account reaches first, and the honest answer there
 * is that nobody has been measured yet. `mixed` is the ordinary case for most
 * coffees and is not a hedge - a coffee that suits somebody's body and not
 * their acidity is genuinely both.
 *
 * Never rendered as a score, a grade, a colour or a percentage. It exists so
 * the app can choose which sentence to write, not so it can rate a bag.
 */
export const MATCH_BANDS = {
  unknown: 'unknown',
  match: 'match',
  mixed: 'mixed',
  mismatch: 'mismatch',
} as const;

export type MatchBand = (typeof MATCH_BANDS)[keyof typeof MATCH_BANDS];

/** One axis, compared. */
export interface AxisMatch {
  readonly axis: TasteAxisName;
  /** Where the coffee sits, as this person will drink it - milk included. */
  readonly coffeeValue: number;
  readonly profileValue: number;
  /** Coffee minus person. Positive means the coffee has more of it. */
  readonly gap: number;
  readonly direction: MatchDirection;
  /**
   * How much this comparison is worth, 0..1: what the person knows about this
   * axis multiplied by what the label knows about it. Either side being blank
   * makes the whole comparison blank, which is the point.
   */
  readonly weight: number;
  /** How well the two meet on this axis, 0..1. */
  readonly fit: number;
  /** Worth arguing from at all - both sides know enough for it to mean anything. */
  readonly isComparable: boolean;
}

/**
 * A coffee held up against a person.
 *
 * Everything here is arithmetic over two things that were measured the same
 * way. That is the whole reason the taste profile and the coffee estimate are
 * folded by one function onto one set of axes with one kind of confidence -
 * the comparison is the point, and it is only trustworthy if neither side had
 * to be translated first.
 */
export interface CoffeeMatch {
  /** All five, in the fixed order, whether or not they could be compared. */
  readonly axes: readonly AxisMatch[];
  /**
   * The coffee as this person will actually drink it - milk included - and
   * what the label was able to say about each axis.
   *
   * Carried out whole so a chart can draw the coffee over the person without
   * redoing the milk adjustment at the call site. Two places applying the same
   * correction are two places that eventually disagree about whether it has
   * been applied, and the picture and the reasons underneath it would then be
   * about two different cups.
   */
  readonly coffeeAxes: TasteAxes;
  readonly coffeeConfidence: TasteAxisConfidence;
  /**
   * The comparable ones, strongest argument first. What a verdict should talk
   * about, and in what order.
   */
  readonly comparable: readonly AxisMatch[];
  /** How much of the five axes could be compared at all, 0..1. */
  readonly coverage: number;
  /** The weighted fit over the comparable axes; null when there are none. */
  readonly fit: number | null;
  readonly band: MatchBand;
}
