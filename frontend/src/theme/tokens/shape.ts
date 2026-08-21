import { RADIUS } from './radius';

/**
 * Which radius each kind of element gets. Consistency matters more than
 * variation: the same kind of element has the same radius everywhere in the
 * app, so components read the intent (`SHAPE.button`) and never the number.
 */
export const SHAPE = {
  icon: RADIUS.xs,
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
} as const;

export type ShapeToken = keyof typeof SHAPE;
