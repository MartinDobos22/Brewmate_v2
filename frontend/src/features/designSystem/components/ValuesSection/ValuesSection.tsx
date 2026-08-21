import type { JSX } from 'react';

import { ValueDisplay } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import {
  formatDuration,
  formatGrams,
  formatRatio,
  formatTemperature,
} from '../../../../lib/formatters';
import { PREVIEW_VALUES } from '../../constants';
import { SectionBlock } from '../SectionBlock';

export const ValuesSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionValues)}>
      <ValueDisplay
        label={t(TRANSLATION_KEYS.dsValueTime)}
        value={formatDuration(PREVIEW_VALUES.brewTimeSeconds)}
        size="hero"
      />
      <ValueDisplay
        label={t(TRANSLATION_KEYS.dsValueDose)}
        value={formatGrams(PREVIEW_VALUES.doseGrams)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
      />
      <ValueDisplay
        label={t(TRANSLATION_KEYS.dsValueTemperature)}
        value={formatTemperature(PREVIEW_VALUES.temperatureCelsius)}
        unit={t(TRANSLATION_KEYS.unitCelsius)}
        size="medium"
      />
      <ValueDisplay
        label={t(TRANSLATION_KEYS.dsValueRatio)}
        value={formatRatio(PREVIEW_VALUES.ratio)}
        size="medium"
        highlighted
      />
    </SectionBlock>
  );
};
