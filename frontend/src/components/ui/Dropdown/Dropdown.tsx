import { useMemo, useState, type JSX } from 'react';

import { DropdownSheet, type DropdownSearch } from './DropdownSheet';
import { DropdownTrigger } from './DropdownTrigger';
import { filterDropdownOptions, type DropdownOption } from './dropdownOption';

export interface DropdownProps {
  readonly label: string;
  readonly placeholder: string;
  readonly options: readonly DropdownOption[];
  /** Null until somebody answers, which is what the placeholder is for. */
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly sheetTitle: string;
  readonly closeLabel: string;
  /** Present only where the list is long enough to be worth typing at. */
  readonly search?: DropdownSearch;
  readonly disabled?: boolean;
}

const EMPTY = '';

/**
 * One answer out of many, on one line, opened in a sheet.
 *
 * A column of option cards is right for a question somebody is being asked -
 * the questionnaire, the water at the cabin - and wrong for a catalogue. The
 * brewing screen had eighteen brewers stacked above the dose, the ratio and
 * the grind, which meant the three numbers this screen exists for were four
 * scrolls below the first thing on it.
 *
 * Choosing closes the sheet and clears the term, because the next time this is
 * opened it is a different question: somebody who came back to change their
 * mind is not continuing the search they abandoned.
 */
export const Dropdown = ({
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  sheetTitle,
  closeLabel,
  search,
  disabled = false,
}: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState(EMPTY);

  /*
   * Keyed on whether there is a search rather than on the search itself: the
   * three strings in it are built at the call site on every render, so
   * depending on the object would mean a memo that never hits.
   */
  const isSearchable = search !== undefined;

  const visible = useMemo(
    (): readonly DropdownOption[] =>
      isSearchable ? filterDropdownOptions(options, term) : options,
    [options, isSearchable, term],
  );

  const close = (): void => {
    setIsOpen(false);
    setTerm(EMPTY);
  };

  return (
    <>
      <DropdownTrigger
        label={label}
        placeholder={placeholder}
        chosen={options.find((option: DropdownOption): boolean => option.id === selectedId)}
        disabled={disabled}
        onPress={(): void => {
          setIsOpen(true);
        }}
      />
      <DropdownSheet
        visible={isOpen}
        title={sheetTitle}
        closeLabel={closeLabel}
        options={visible}
        selectedId={selectedId}
        search={search}
        term={term}
        onTermChange={setTerm}
        onSelect={(id: string): void => {
          onSelect(id);
          close();
        }}
        onClose={close}
      />
    </>
  );
};
