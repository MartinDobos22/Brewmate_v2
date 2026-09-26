import { BEAN_SHIFT_LIMIT } from './grindGuidanceFieldLimits.js';
import type { GrindShift } from './grindShiftSources.js';

const NOTHING = 0;

/**
 * Everything the bag says, as one move, never past the bean's own allowance.
 *
 * Its own function because two things have to agree on it exactly: the
 * guidance that moves a starting point by it, and the reading that takes it
 * back off a setting somebody actually brewed at to see what is left over.
 * Two copies of the cap would be two definitions of "what the bag explains",
 * and the difference between them would be read as somebody's habit.
 */
export const sumBeanGrindShift = (shifts: readonly GrindShift[]): number =>
  Math.min(
    Math.max(
      shifts.reduce((sum: number, entry: GrindShift): number => sum + entry.amount, NOTHING),
      -BEAN_SHIFT_LIMIT,
    ),
    BEAN_SHIFT_LIMIT,
  );
