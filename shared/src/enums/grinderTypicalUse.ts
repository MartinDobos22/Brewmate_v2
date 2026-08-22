/** What a grinder is built for. Filters the picker down to plausible gear. */
export const GRINDER_TYPICAL_USES = {
  espresso: 'espresso',
  filter: 'filter',
  both: 'both',
} as const;

export type GrinderTypicalUse = (typeof GRINDER_TYPICAL_USES)[keyof typeof GRINDER_TYPICAL_USES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const GRINDER_TYPICAL_USE_VALUES = [
  GRINDER_TYPICAL_USES.espresso,
  GRINDER_TYPICAL_USES.filter,
  GRINDER_TYPICAL_USES.both,
] as const;
