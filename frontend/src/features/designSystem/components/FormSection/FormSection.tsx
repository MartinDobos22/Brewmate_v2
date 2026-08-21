import { useState, type JSX } from 'react';

import { Input, NumberStepper, Slider } from '../../../../components/ui';
import { DOSE_GRAMS } from '../../../../constants';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { GRIND_RANGE, PREVIEW_VALUES } from '../../constants';
import { SectionBlock } from '../SectionBlock';

export const FormSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [grind, setGrind] = useState<number>(PREVIEW_VALUES.grind);
  const [dose, setDose] = useState<number>(PREVIEW_VALUES.doseGrams);

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionInputs)}>
      <Input
        label={t(TRANSLATION_KEYS.dsInputLabel)}
        value={name}
        onChangeText={setName}
        placeholder={t(TRANSLATION_KEYS.dsInputPlaceholder)}
        helpText={t(TRANSLATION_KEYS.dsInputHelp)}
      />
      <Input
        label={t(TRANSLATION_KEYS.dsInputErrorLabel)}
        value={name}
        onChangeText={setName}
        errorText={t(TRANSLATION_KEYS.dsInputErrorText)}
      />
      <Slider
        label={t(TRANSLATION_KEYS.dsSliderLabel)}
        value={grind}
        formattedValue={String(grind)}
        range={GRIND_RANGE}
        onChange={setGrind}
      />
      <NumberStepper
        label={t(TRANSLATION_KEYS.dsStepperLabel)}
        formattedValue={formatGrams(dose)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
        decreaseLabel={t(TRANSLATION_KEYS.decrease)}
        increaseLabel={t(TRANSLATION_KEYS.increase)}
        canDecrease={dose > DOSE_GRAMS.min}
        canIncrease={dose < DOSE_GRAMS.max}
        onDecrease={(): void => {
          setDose(dose - DOSE_GRAMS.step);
        }}
        onIncrease={(): void => {
          setDose(dose + DOSE_GRAMS.step);
        }}
      />
    </SectionBlock>
  );
};
