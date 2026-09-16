import { useState, type JSX } from 'react';

import { Dropdown, type DropdownOption } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { PREVIEW_DROPDOWN_OPTIONS, type PreviewDropdownOption } from '../../constants';
import { SectionBlock } from '../SectionBlock';

const NOTHING = null;

/**
 * Both dropdowns side by side: the one that can be typed at and the one that
 * cannot.
 *
 * The pair is the point. A search box is right for a catalogue and wrong for a
 * question with five answers, where a keyboard would cover three of them, and
 * the only way to check that both still look like the same control is to see
 * them together.
 */
export const DropdownSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [searchable, setSearchable] = useState<string | null>(NOTHING);
  const [plain, setPlain] = useState<string | null>(PREVIEW_DROPDOWN_OPTIONS[0]?.id ?? NOTHING);

  const options: readonly DropdownOption[] = PREVIEW_DROPDOWN_OPTIONS.map(
    (option: PreviewDropdownOption): DropdownOption => ({
      id: option.id,
      label: t(option.labelKey),
      note: t(option.noteKey),
      icon: option.icon,
    }),
  );

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionDropdown)}>
      <Dropdown
        label={t(TRANSLATION_KEYS.dsDropdownSearchableLabel)}
        placeholder={t(TRANSLATION_KEYS.preBrewMethodPlaceholder)}
        options={options}
        selectedId={searchable}
        sheetTitle={t(TRANSLATION_KEYS.preBrewMethodSheetTitle)}
        closeLabel={t(TRANSLATION_KEYS.actionClose)}
        search={{
          label: t(TRANSLATION_KEYS.preBrewMethodSearchLabel),
          placeholder: t(TRANSLATION_KEYS.preBrewMethodSearchPlaceholder),
          emptyLabel: t(TRANSLATION_KEYS.preBrewMethodSearchEmpty),
        }}
        onSelect={setSearchable}
      />
      <Dropdown
        label={t(TRANSLATION_KEYS.dsDropdownPlainLabel)}
        placeholder={t(TRANSLATION_KEYS.preBrewMethodPlaceholder)}
        options={options}
        selectedId={plain}
        sheetTitle={t(TRANSLATION_KEYS.preBrewMethodSheetTitle)}
        closeLabel={t(TRANSLATION_KEYS.actionClose)}
        onSelect={setPlain}
      />
    </SectionBlock>
  );
};
