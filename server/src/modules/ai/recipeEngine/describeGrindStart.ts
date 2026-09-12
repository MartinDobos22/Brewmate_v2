import {
  GRIND_SHIFT_SOURCES,
  resolveGrindGuidance,
  type BrewMethodCategory,
  type GrindBand,
  type GrindCoffeeFacts,
  type GrindGuidance,
  type GrindShift,
  type GrindShiftSource,
  type Grinder,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
  PROMPT_LIST_SEPARATOR,
} from '../constants/promptFormatting.js';

const NOTHING = 0;
const EMPTY = '';
const COARSER = 'coarser';
const FINER = 'finer';

const MICRONS = 'µm';
const NO_REASONS =
  'nothing, because nothing is known about this coffee - this is the middle of the window for the method alone';

const line = (label: string, value: string): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value].join(EMPTY);

const band = (values: GrindBand, unit: string): string =>
  `about ${String(values.target)}${unit}, and anywhere from ${String(values.min)} to ${String(values.max)}${unit} is sensible`;

/**
 * What each fact off the bag is called when the reason is written out.
 *
 * Total over the sources rather than a lookup with a fallback, so adding a
 * fact the guidance reads is a type error here instead of a reason that
 * silently disappears out of the rationale it was supposed to explain.
 */
const SHIFT_NAMES: Record<GrindShiftSource, string> = {
  [GRIND_SHIFT_SOURCES.roastLevel]: 'how dark it was roasted',
  [GRIND_SHIFT_SOURCES.process]: 'how it was processed',
  [GRIND_SHIFT_SOURCES.restDays]: 'how long ago it was roasted',
};

const describeShift = (shift: GrindShift): string =>
  `${SHIFT_NAMES[shift.source]} (${shift.amount > NOTHING ? COARSER : FINER})`;

const describeReasons = (shifts: readonly GrindShift[]): string =>
  shifts.length === NOTHING ? NO_REASONS : shifts.map(describeShift).join(PROMPT_LIST_SEPARATOR);

/**
 * The collar, where the catalogue knows enough to name one.
 *
 * The step advice is the half that matters most and the half no prompt can
 * supply on its own: what a click is worth differs by an order of magnitude
 * between an espresso collar and a filter one, so "one or two clicks finer"
 * is either a nudge or a different drink depending on whose grinder it is
 * said to.
 */
const describeCollar = (guidance: GrindGuidance): readonly string[] => {
  if (guidance.setting === null) {
    return [
      line(
        'on their own collar',
        'no number - their grinder has no micron curve in the catalogue, so answer with grindSetting null and put the grind in words',
      ),
    ];
  }

  return [
    line('on their own collar', band(guidance.setting, EMPTY)),
    ...(guidance.step === null
      ? []
      : [
          line(
            'what one unit of that collar is worth',
            `about ${String(guidance.step.micronsPerSetting)} ${MICRONS}, so one adjustment they could actually taste is ${String(guidance.step.settings)} of them`,
          ),
        ]),
    ...(guidance.isCollarEstimated
      ? [
          line(
            'how much that number is worth',
            'the curve behind it was read off a specification rather than measured, or the entry is somebody own contribution - so it is a place to start dialling from, not an answer',
          ),
        ]
      : []),
  ];
};

export interface GrindStartDescription {
  readonly methodCategory: BrewMethodCategory;
  readonly coffee: GrindCoffeeFacts;
  readonly grinder: Grinder | null;
}

/**
 * Where to put the collar before the first cup, worked out before the model is
 * asked anything.
 *
 * This is arithmetic handed over as a fact, not a suggestion the answer may
 * take or leave quietly. Without it the grind is the one number in a recipe
 * with nothing behind it: the model is told the collar runs 0 to 40 in steps
 * of 1 and has to invent a place on it, which is how the same coffee in the
 * same brewer comes back at 18 one morning and 26 the next.
 *
 * With it the number is derived from the method's own micron window, moved by
 * what the bag actually says, and read through the curve for that specific
 * grinder - and the model's job goes back to what a model is for: the pour
 * schedule, the temperature, and explaining the whole thing to somebody
 * standing in their kitchen.
 */
export const describeGrindStart = ({
  methodCategory,
  coffee,
  grinder,
}: GrindStartDescription): string => {
  const guidance = resolveGrindGuidance({ methodCategory, coffee, grinder });

  return [
    'Where to start the grind. This was computed from the method, the bag and their grinder curve before you were asked, so treat it as a measurement rather than a suggestion:',
    line(
      'the particle size this method and this coffee want',
      band(guidance.microns, ` ${MICRONS}`),
    ),
    line('which is, in words', guidance.descriptor),
    line(
      'what moved it off the middle of the window for this method',
      describeReasons(guidance.shifts),
    ),
    ...describeCollar(guidance),
  ].join(PROMPT_LINE_SEPARATOR);
};
