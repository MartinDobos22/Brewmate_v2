/**
 * The two constants that decide how much a set of answers is worth.
 *
 * Both are about the questionnaire's confidence in itself, never about the
 * values it reports. What somebody answered is what the profile records; these
 * only decide how loudly the app is then entitled to claim it knows them.
 */

/**
 * How far two answers about the same axis have to disagree before they cancel
 * out, on the 0-10 axis scale.
 *
 * Three points of average deviation is somebody saying they cannot stand a
 * sour cup and, four questions later, that what they want is a bright fruity
 * coffee. Both answers are honest and they describe different drinks, so the
 * only true reading of the pair is that this app does not yet know which one
 * they meant - and saying so is the whole point of measuring this. Averaging
 * them silently produces 5,5, which is a confident statement of the one thing
 * the person definitely did not say.
 */
export const MAX_AXIS_DISAGREEMENT = 3;

/**
 * How much answering it takes before an axis counts as properly covered.
 *
 * Two direct answers, or three indirect ones. An axis that one question
 * brushed against in passing is a hint, and the profile should carry it as
 * one rather than as a finding - the difference shows up on the chart as a
 * vertex nobody has earned yet.
 */
export const FULL_AXIS_COVERAGE = 2;
