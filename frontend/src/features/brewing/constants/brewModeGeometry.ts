import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const FULL_TURN = 2;
const RING_RADIUS = 124;
const CENTER = 150;
const START_ANGLE = -90;

/**
 * The pour ring, in its own coordinate space.
 *
 * Here rather than in the theme for the reason the taste web's geometry is:
 * a stroke ten units wide is ten units of a 300-unit square, and expressing it
 * in the same scale as a card's padding would make both harder to change.
 *
 * The four guide circles are a V60 seen from above. They are not a scale and
 * nothing is read off them - they are what stops the ring reading as a
 * progress bar bent into a circle.
 */
export const POUR_RING = {
  size: 300,
  center: CENTER,
  radius: RING_RADIUS,
  strokeWidth: 10,
  /** What a full sweep of the arc measures, so the dash array cannot drift. */
  circumference: FULL_TURN * Math.PI * RING_RADIUS,
  guideRadii: [138, 106, 74, 42],
  guideStrokeWidth: 1,
  /**
   * Twelve o'clock rather than three: a pour starts at the top.
   *
   * Written as an SVG transform rather than as the shape's own rotation
   * props, which react-native-svg has deprecated in favour of exactly this.
   */
  startTransform: `rotate(${String(START_ANGLE)}, ${String(CENTER)}, ${String(CENTER)})`,
} as const;

/**
 * The warm light behind the ring.
 *
 * A single soft source off the top left, which is the only thing on this
 * screen that is not information. It exists because a flat near-black
 * rectangle reads as a screen that has failed rather than as one deliberately
 * turned down, and because it puts the ring in a room.
 */
export const BREW_WARM_LIGHT = {
  size: 470,
  top: 210,
  left: -40,
  /** Where the glow has faded to nothing, as a share of its radius. */
  edgeStop: 0.62,
  centerOpacity: 0.08,
  edgeOpacity: 0,
} as const;

/**
 * The chip inside the ring that says what the scale should read.
 *
 * On a dripper the whole of "what do I do now" is a number on the scale, so it
 * sits inside the ring with the countdown rather than in a row underneath it -
 * the two things being watched are in one glance.
 */
export const BREW_SCALE_CHIP = {
  height: 38,
  paddingHorizontal: 16,
  gap: 9,
  iconSize: 17,
  icon: 'scale' satisfies GlyphName,
  /**
   * The icon breathes while the weight is landing: one cycle every two
   * seconds, which is slower than a pour is adjusted and faster than it reads
   * as a fault.
   */
  pulseHalfCycleMs: 1000,
  pulseMinOpacity: 0.55,
} as const;

/** The line under the ring that says what is coming, at a glance and no more. */
export const BREW_NEXT_PILL = {
  height: 34,
  paddingHorizontal: 16,
  gap: 8,
  icon: 'arrow-right' satisfies GlyphName,
} as const;

/**
 * The three controls, which are the largest touch targets in the app.
 *
 * Deliberately past every guideline: the finger pressing them is wet, in a
 * hurry, and aiming at a phone propped against a kettle.
 */
export const BREW_CONTROL_ICONS = {
  primarySize: 27,
  secondarySize: 23,
  pause: 'pause' satisfies GlyphName,
  resume: 'play' satisfies GlyphName,
  start: 'play' satisfies GlyphName,
  restart: 'restart' satisfies GlyphName,
  skip: 'skip-next-outline' satisfies GlyphName,
  finish: 'check' satisfies GlyphName,
} as const;
