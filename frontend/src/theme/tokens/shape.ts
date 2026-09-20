import { RADIUS } from './radius';

/**
 * Which radius each kind of element gets. Consistency matters more than
 * variation: the same kind of element has the same radius everywhere in the
 * app, so components read the intent (`SHAPE.button`) and never the number.
 */
export const SHAPE = {
  icon: RADIUS.xs,
  checkbox: RADIUS.xs,
  badge: RADIUS.xs,
  chip: RADIUS.sm,
  input: RADIUS.sm,
  smallButton: RADIUS.sm,
  button: RADIUS.md,
  listItem: RADIUS.md,
  card: RADIUS.lg,
  sheet: RADIUS.xl,
  modal: RADIUS.xl,
  /** Avatar and circular progress only. Nothing else is a circle. */
  avatar: RADIUS.full,
  progressRing: RADIUS.full,
  /** The one pill in the app: a badge carrying a number. */
  counterBadge: RADIUS.full,
  /**
   * The A2 redesign's own structures. Each is a kind of element rather than a
   * new size of one above it, so it is named here rather than read off
   * `RADIUS` at a call site.
   */
  softCard: RADIUS.lgPlus,
  /**
   * A chat bubble, and the one corner of it that is tightened.
   *
   * Three corners keep the soft radius and the fourth is pulled in towards
   * whoever is speaking, which is what gives a conversation its direction
   * without anybody having to draw a tail on it.
   */
  bubble: RADIUS.lgPlus,
  bubbleTail: RADIUS.xs,
  /** A block inset within an espresso header. */
  insetBlock: RADIUS.lgPlus,
  /** A card that groups an act rather than a report - the correction card. */
  xlCard: RADIUS.xl,
  /** The one card on a screen that carries the answer the screen exists for. */
  heroCard: RADIUS.xxl,
  /** The espresso header itself: square at the top, rounded where it ends. */
  headerBlock: RADIUS.xxxl,
  /**
   * Anything whose radius is half its own height - a pill button, an
   * attribute chip, a circular icon button. Stated as a kind rather than as a
   * number, because the number is different on every one of them and wrong
   * the moment the height changes.
   */
  pill: RADIUS.full,
} as const;

export type ShapeToken = keyof typeof SHAPE;
