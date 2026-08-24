import {
  EQUIPMENT_TYPES,
  readBrewerParams,
  readKettleParams,
  readScaleParams,
  type BrewMethod,
  type Equipment,
  type Grinder,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const UNNAMED = 'unnamed';
const NAME_SEPARATOR = ' ';
const EMPTY = '';
const NOT_MEASURED = 'not measured';
const NO_GEAR = 'They have written down no equipment for this brew beyond the method itself.';

const nameOf = (item: Equipment): string => {
  const name = [item.brand, item.model]
    .filter((part: string | null): part is string => part !== null && part !== EMPTY)
    .join(NAME_SEPARATOR);

  return name === EMPTY ? UNNAMED : name;
};

const line = (label: string, value: string): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value].join(EMPTY);

const measurement = (value: number | undefined, unit: string): string =>
  value === undefined ? NOT_MEASURED : `${String(value)} ${unit}`;

const MILLILITRES = 'ml';
const GRAMS = 'g';
const MILLIMETRES = 'mm';

const describeBrewer = (item: Equipment): string => {
  const params = readBrewerParams(item.params);

  return [
    line('Brewer', nameOf(item)),
    line('  its capacity', measurement(params.capacityMl, MILLILITRES)),
    line('  its smallest sensible dose', measurement(params.doseMinGrams, GRAMS)),
    line('  its largest sensible dose', measurement(params.doseMaxGrams, GRAMS)),
    line(
      '  its basket, if it is an espresso brewer',
      measurement(params.basketSizeMm, MILLIMETRES),
    ),
  ].join(PROMPT_LINE_SEPARATOR);
};

const describeKettle = (item: Equipment): string =>
  [
    line('Kettle', nameOf(item)),
    line(
      '  can it hold a temperature',
      readKettleParams(item.params).hasTemperatureControl === true ? 'yes' : 'not stated',
    ),
  ].join(PROMPT_LINE_SEPARATOR);

const describeScale = (item: Equipment): string => {
  const params = readScaleParams(item.params);

  return [
    line('Scale', nameOf(item)),
    line('  its resolution', measurement(params.resolutionGrams, GRAMS)),
    line('  does it have a timer', params.hasTimer === true ? 'yes' : 'not stated'),
  ].join(PROMPT_LINE_SEPARATOR);
};

/**
 * The grinder, and how much its collar is worth as an instruction.
 *
 * The unit type and the range are what make a number in the answer meaningful:
 * "22" means one thing on a forty-click collar and nothing at all on a
 * stepless one. Where the grinder is not in the catalogue, that is said
 * outright so the model writes the grind in words rather than inventing a
 * scale to put a number on.
 */
const describeGrinder = (item: Equipment, catalogued: Grinder | null): string => {
  if (catalogued === null) {
    return [
      line('Grinder', nameOf(item)),
      line(
        '  its scale',
        'not in the catalogue, so you do not know what its collar is marked in - answer with grindSetting null and describe the grind in words',
      ),
    ].join(PROMPT_LINE_SEPARATOR);
  }

  return [
    line('Grinder', `${catalogued.brand} ${catalogued.model}`),
    line('  what its collar is marked in', catalogued.unitType),
    line(
      '  its range',
      `${String(catalogued.minSetting)} to ${String(catalogued.maxSetting)}, in steps of ${String(catalogued.step)}`,
    ),
    line('  what it is built for', catalogued.typicalUse),
  ].join(PROMPT_LINE_SEPARATOR);
};

const describeItem = (item: Equipment, catalogued: Grinder | null): string | null => {
  if (item.type === EQUIPMENT_TYPES.brewer) {
    return describeBrewer(item);
  }

  if (item.type === EQUIPMENT_TYPES.kettle) {
    return describeKettle(item);
  }

  if (item.type === EQUIPMENT_TYPES.scale) {
    return describeScale(item);
  }

  return describeGrinder(item, catalogued);
};

export interface GearDescription {
  readonly method: BrewMethod;
  readonly equipment: readonly Equipment[];
  /** The catalogue entry behind their grinder, where there is one. */
  readonly grinder: Grinder | null;
}

/**
 * The method and the gear it will be brewed on.
 *
 * The method's own ratio window travels with it, because that window is what
 * tells the model whether the ratio this person chose is ordinary for the
 * method or unusual enough to be worth a sentence in the rationale.
 */
export const describeGear = ({ method, equipment, grinder }: GearDescription): string =>
  [
    'The method and the gear:',
    line('Method', `${method.nameSk} (category: ${method.category})`),
    line(
      '  the usual ratio window for this method',
      `1:${String(method.defaultRatioRange.min)} to 1:${String(method.defaultRatioRange.max)}`,
    ),
    ...(equipment.length === NOTHING
      ? [NO_GEAR]
      : equipment
          .map((item: Equipment): string | null => describeItem(item, grinder))
          .filter((entry: string | null): entry is string => entry !== null)),
  ].join(PROMPT_LINE_SEPARATOR);
