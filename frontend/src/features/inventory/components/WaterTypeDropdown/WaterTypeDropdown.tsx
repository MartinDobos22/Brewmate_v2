import { WATER_TYPES, type WaterType } from '@brewmate/shared';
import { useMemo, type JSX } from 'react';

import { Dropdown, type DropdownOption } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type Translator } from '../../../../i18n';
import { WATER_TYPE_OPTIONS, type WaterTypeOption } from '../../constants';

export interface WaterTypeDropdownProps {
  readonly selected: WaterType;
  readonly onSelect: (waterType: WaterType) => void;
  readonly disabled?: boolean;
}

const toOption = (option: WaterTypeOption, t: Translator['t']): DropdownOption => ({
  id: option.waterType,
  label: t(option.labelKey),
  note: t(option.noteKey),
});

/**
 * The same five answers as the cards, on one line.
 *
 * The cards belong to onboarding, where this is the only question on the
 * screen and a wrong tap costs somebody a step. On the brewing screen it is
 * one of six answers, it is nearly always already right - it comes from the
 * profile - and five cards of it sat between the brewer and the dose.
 *
 * No search. Five options do not need one, and a keyboard opening over a sheet
 * that holds five answers would cover three of them.
 */
export const WaterTypeDropdown = ({
  selected,
  onSelect,
  disabled = false,
}: WaterTypeDropdownProps): JSX.Element => {
  const { t } = useTranslation();

  const options = useMemo(
    (): readonly DropdownOption[] =>
      WATER_TYPE_OPTIONS.map((option: WaterTypeOption): DropdownOption => toOption(option, t)),
    [t],
  );

  return (
    <Dropdown
      label={t(TRANSLATION_KEYS.preBrewWaterTypeLabel)}
      placeholder={t(TRANSLATION_KEYS.setupWaterUnknown)}
      options={options}
      selectedId={selected}
      sheetTitle={t(TRANSLATION_KEYS.preBrewWaterSection)}
      closeLabel={t(TRANSLATION_KEYS.actionClose)}
      disabled={disabled}
      onSelect={(id: string): void => {
        const chosen = WATER_TYPE_OPTIONS.find(
          (option: WaterTypeOption): boolean => option.waterType === id,
        );

        onSelect(chosen?.waterType ?? WATER_TYPES.unknown);
      }}
    />
  );
};
