import { z } from 'zod';

import { BREW_METHOD_CATEGORY_VALUES } from '../enums/brewMethodCategories.js';
import { HABIT_SHIFT_LIMIT } from '../grindGuidance/grindGuidanceFieldLimits.js';

const NOTHING = 0;

/**
 * Where somebody's grind ends up on one grinder in one family of brewer, past
 * what their bags explained.
 *
 * Per grinder, because a habit on a collar is half about the person and half
 * about the collar: burr alignment, how far the catalogue curve is off for this
 * unit, a hand grinder packed for travel against the electric one at home.
 * Averaged across both, the habit would be right about neither - and the one
 * used twice a year would be dragged about by the one used every morning.
 *
 * Per family rather than per method, because that is the unit the guidance
 * works in: every shift is a fraction of a family's window, and two drippers
 * share one. `shift` is null until the evidence is enough to call it a habit,
 * and zero once it is and the habit is to grind where the bag says - two
 * different answers that a single null would have collapsed into one.
 */
export const grindHabitSchema = z.object({
  /** The owned grinder, as the equipment row the recipe named. */
  grinderEquipmentId: z.uuid(),
  methodCategory: z.enum(BREW_METHOD_CATEGORY_VALUES),
  /** The cups whose grind could be measured, not every cup in the family. */
  cupCount: z.number().int().min(NOTHING),
  /** How many different coffees those cups were ground from. */
  coffeeCount: z.number().int().min(NOTHING),
  /** A fraction of the window's half-width. Positive is coarser. */
  shift: z.number().min(-HABIT_SHIFT_LIMIT).max(HABIT_SHIFT_LIMIT).nullable(),
});

export type GrindHabit = z.infer<typeof grindHabitSchema>;
