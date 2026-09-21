import type { JSX } from 'react';
import { ScrollView, View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Input } from '../Input';
import { OptionCard } from '../OptionCard';
import { Sheet } from '../Sheet';
import { Text } from '../Text';

import { createDropdownStyles } from './Dropdown.styles';
import { DROPDOWN_ICONS } from './dropdownIcons';
import type { DropdownOption } from './dropdownOption';

/** The copy a searchable dropdown needs. Absent means the list is short enough. */
export interface DropdownSearch {
  readonly label: string;
  readonly placeholder: string;
  readonly emptyLabel: string;
}

export interface DropdownSheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly closeLabel: string;
  readonly options: readonly DropdownOption[];
  readonly selectedId: string | null;
  readonly search: DropdownSearch | undefined;
  readonly term: string;
  readonly onTermChange: (term: string) => void;
  readonly onSelect: (id: string) => void;
  readonly onClose: () => void;
}

const NOTHING = 0;

/**
 * The open dropdown: the same option cards the screen used to be made of,
 * moved into a panel that can be as long as it needs to be.
 *
 * The search box appears only where it earns its place. Five kinds of water do
 * not need one - a keyboard covering three of the five answers is worse than
 * no box at all - and eighteen brewing methods do.
 */
export const DropdownSheet = ({
  visible,
  title,
  closeLabel,
  options,
  selectedId,
  search,
  term,
  onTermChange,
  onSelect,
  onClose,
}: DropdownSheetProps): JSX.Element => {
  const styles = useThemedStyles(createDropdownStyles);

  return (
    <Sheet visible={visible} title={title} closeLabel={closeLabel} onClose={onClose}>
      {search === undefined ? null : (
        <Input
          label={search.label}
          icon={DROPDOWN_ICONS.search}
          placeholder={search.placeholder}
          value={term}
          onChangeText={onTermChange}
          autoCapitalize="none"
        />
      )}
      <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
        {options.length === NOTHING && search !== undefined ? (
          <View style={styles.empty}>
            <Text variant="bodyMedium" tone="muted">
              {search.emptyLabel}
            </Text>
          </View>
        ) : (
          <View style={styles.options}>
            {options.map((option: DropdownOption): JSX.Element => (
              <OptionCard
                key={option.id}
                label={option.label}
                note={option.note}
                icon={option.icon}
                selected={option.id === selectedId}
                onPress={(): void => {
                  onSelect(option.id);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
};
