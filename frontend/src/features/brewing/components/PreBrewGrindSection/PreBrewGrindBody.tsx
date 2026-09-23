import type { GrindGuidance, GrindShift } from '@brewmate/shared';
import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type Translator } from '../../../../i18n';
import { GRIND_DESCRIPTOR_LABEL_KEYS, GRIND_SHIFT_LABEL_KEYS } from '../../constants';
import type { GrindGuidanceReading } from '../../hooks/useGrindGuidance';

import { PreBrewGrindRow } from './PreBrewGrindRow';

const NOTHING = 0;
const NUMERIC = true;

/**
 * One reason, as a sentence rather than two words glued together at the call
 * site: Slovak puts the direction in a different place from English, and a
 * phrase assembled from fragments is a phrase no translator ever saw.
 */
const describeShift = (shift: GrindShift, t: Translator['t']): string =>
  t(TRANSLATION_KEYS.preBrewGrindShiftEntry, {
    fact: t(GRIND_SHIFT_LABEL_KEYS[shift.source]),
    direction: t(
      shift.amount > NOTHING
        ? TRANSLATION_KEYS.preBrewGrindCoarser
        : TRANSLATION_KEYS.preBrewGrindFiner,
    ),
  });

export interface PreBrewGrindBodyProps {
  readonly reading: GrindGuidanceReading;
  readonly guidance: GrindGuidance;
}

/**
 * The facts themselves, split out so the card around them stays inside its
 * line budget and so the two shapes this answer takes - a number on a collar,
 * or a word and an explanation of why there is no number - sit next to each
 * other where they can be read together.
 */
export const PreBrewGrindBody = ({ reading, guidance }: PreBrewGrindBodyProps): JSX.Element => {
  const { t } = useTranslation();
  const { setting, step, shifts } = guidance;

  return (
    <>
      {setting === null ? null : (
        <PreBrewGrindRow
          label={t(TRANSLATION_KEYS.preBrewGrindOnCollar, {
            grinder: reading.grinderName ?? '',
          })}
          numeric={NUMERIC}
          value={t(TRANSLATION_KEYS.preBrewGrindBand, {
            target: setting.target,
            min: setting.min,
            max: setting.max,
          })}
        />
      )}
      <PreBrewGrindRow
        label={t(TRANSLATION_KEYS.preBrewGrindWords)}
        value={t(GRIND_DESCRIPTOR_LABEL_KEYS[guidance.descriptor])}
      />
      {step === null ? null : (
        <PreBrewGrindRow
          label={t(TRANSLATION_KEYS.preBrewGrindStep)}
          numeric={NUMERIC}
          value={t(TRANSLATION_KEYS.preBrewGrindStepValue, {
            settings: step.settings,
            microns: step.micronsPerSetting,
          })}
        />
      )}
      <PreBrewGrindRow
        label={t(TRANSLATION_KEYS.preBrewGrindReasons)}
        value={
          shifts.length === NOTHING
            ? t(TRANSLATION_KEYS.preBrewGrindNoReasons)
            : shifts
                .map((shift: GrindShift): string => describeShift(shift, t))
                .join(t(TRANSLATION_KEYS.listSeparator))
        }
      />
      {setting !== null ? null : (
        <Text variant="bodyText" tone="muted">
          {t(
            reading.hasGrinder
              ? TRANSLATION_KEYS.preBrewGrindNoCurve
              : TRANSLATION_KEYS.preBrewGrindNoGrinder,
          )}
        </Text>
      )}
      {guidance.isCollarEstimated && setting !== null ? (
        <Text variant="bodyText" tone="muted">
          {t(TRANSLATION_KEYS.preBrewGrindEstimated)}
        </Text>
      ) : null}
    </>
  );
};
