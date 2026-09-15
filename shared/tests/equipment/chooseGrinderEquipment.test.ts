import { describe, expect, it } from 'vitest';

import {
  EQUIPMENT_TYPES,
  chooseGrinderEquipment,
  listGrinderEquipment,
  type Equipment,
  type EquipmentType,
} from '../../src/index.js';

const TIMESTAMP = '2026-01-01T00:00:00.000Z';
const CATALOGUE_ID = '11111111-1111-4111-8111-111111111111';

interface GearFixture {
  readonly id: string;
  readonly type?: EquipmentType;
  readonly catalogGrinderId?: string | null;
}

const gear = ({
  id,
  type = EQUIPMENT_TYPES.grinder,
  catalogGrinderId = null,
}: GearFixture): Equipment => ({
  id,
  userId: '22222222-2222-4222-8222-222222222222',
  type,
  catalogGrinderId,
  brand: null,
  model: null,
  params: {},
  isActive: true,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
});

/**
 * The rule both sides of the wire run when nobody said which grinder.
 *
 * Tested here rather than in either package because that is the whole point of
 * it living in the contract: the app draws a band and a click size off this
 * answer before a token is spent, and the API writes a recipe off the same one
 * afterwards. What these cases defend is that the two get the same grinder,
 * and that "no grinder at all" stays a different answer from "a grinder the
 * catalogue has never met".
 */
describe('chooseGrinderEquipment', () => {
  it('prefers a catalogued grinder to one that came first', () => {
    const uncatalogued = gear({ id: 'a' });
    const catalogued = gear({ id: 'b', catalogGrinderId: CATALOGUE_ID });

    expect(chooseGrinderEquipment([uncatalogued, catalogued])).toBe(catalogued);
  });

  it('falls back to the first grinder when none is catalogued', () => {
    const first = gear({ id: 'a' });

    expect(chooseGrinderEquipment([first, gear({ id: 'b' })])).toBe(first);
  });

  it('ignores everything that is not a grinder', () => {
    const kettle = gear({ id: 'a', type: EQUIPMENT_TYPES.kettle });
    const grinder = gear({ id: 'b' });

    expect(chooseGrinderEquipment([kettle, grinder])).toBe(grinder);
    expect(listGrinderEquipment([kettle, grinder])).toEqual([grinder]);
  });

  /* Owning nothing to grind with means the coffee arrives already ground,
   * which is a different thing to tell somebody than a grind in words. */
  it('answers with nothing when there is nothing to grind on', () => {
    expect(chooseGrinderEquipment([gear({ id: 'a', type: EQUIPMENT_TYPES.brewer })])).toBeNull();
    expect(chooseGrinderEquipment([])).toBeNull();
  });
});
