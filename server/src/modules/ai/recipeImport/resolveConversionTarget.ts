import {
  EQUIPMENT_TYPES,
  UNMEASURED_BREWER,
  readBrewerParams,
  type BrewConstraints,
  type BrewMethod,
  type ConversionBrewer,
  type ConversionTarget,
  type Equipment,
  type Grinder,
} from '@brewmate/shared';

export interface ConversionTargetInput {
  readonly method: BrewMethod;
  readonly equipment: readonly Equipment[];
  readonly grinder: Grinder | null;
  readonly constraints: BrewConstraints;
}

/**
 * The brewer this method is actually made in, as far as anybody measured it.
 *
 * The gear has already been narrowed to what this method can be brewed with,
 * so the first brewer in the list is the right one. A brewer nobody measured
 * contributes nothing rather than a guess: the conversion then leaves the
 * amounts where their author put them, which is the honest answer to "will
 * this fit?" when nobody knows how big the thing is.
 */
const readBrewer = (equipment: readonly Equipment[]): ConversionBrewer => {
  const brewer = equipment.find((item: Equipment): boolean => item.type === EQUIPMENT_TYPES.brewer);

  if (brewer === undefined) {
    return UNMEASURED_BREWER;
  }

  const params = readBrewerParams(brewer.params);

  return {
    capacityMl: params.capacityMl ?? null,
    doseMinGrams: params.doseMinGrams ?? null,
    doseMaxGrams: params.doseMaxGrams ?? null,
  };
};

/**
 * The kitchen a foreign recipe is being converted into.
 *
 * Two of these fields are read off the declared constraints rather than off
 * the equipment rows, and deliberately: "can you set a temperature" and "can
 * you move the grind" are questions this person has already answered on the
 * screen before this one, for this brew, and their answer outranks whatever
 * the cupboard says. Somebody at a cabin owns a variable-temperature kettle
 * that is at home on the counter.
 */
export const resolveConversionTarget = ({
  method,
  equipment,
  grinder,
  constraints,
}: ConversionTargetInput): ConversionTarget => ({
  methodCategory: method.category,
  ratioRange: method.defaultRatioRange,
  grinder,
  brewer: readBrewer(equipment),
  hasTemperatureControl: constraints.noTemperatureControl !== true,
  canAdjustGrind: constraints.noGrinder !== true && constraints.fixedGrindSetting !== true,
});
