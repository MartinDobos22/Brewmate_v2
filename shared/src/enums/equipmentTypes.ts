/** The kinds of gear Brewmate knows about. */
export const EQUIPMENT_TYPES = {
  grinder: 'grinder',
  brewer: 'brewer',
  kettle: 'kettle',
  scale: 'scale',
} as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[keyof typeof EQUIPMENT_TYPES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const EQUIPMENT_TYPE_VALUES = [
  EQUIPMENT_TYPES.grinder,
  EQUIPMENT_TYPES.brewer,
  EQUIPMENT_TYPES.kettle,
  EQUIPMENT_TYPES.scale,
] as const;
