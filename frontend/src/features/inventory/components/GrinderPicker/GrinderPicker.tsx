import type { Grinder } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useGrinderCatalog } from '../../hooks';
import { AddGrinderSheet } from '../AddGrinderSheet';
import { GrinderList } from '../GrinderList';
import { GrinderSearchField } from '../GrinderSearchField';

import { createGrinderPickerStyles } from './GrinderPicker.styles';

export interface GrinderPickerProps {
  readonly onSelect: (grinder: Grinder) => void;
}

/**
 * The catalogue, turned into a picker.
 *
 * A grinder that was just contributed is handed straight back to the caller,
 * so somebody who had to add their own does not then have to find it in a
 * list they already know it is not in.
 */
export const GrinderPicker = ({ onSelect }: GrinderPickerProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderPickerStyles);
  const { t } = useTranslation();
  const catalog = useGrinderCatalog();
  const [adding, setAdding] = useState(false);

  const openSheet = (): void => {
    setAdding(true);
  };

  return (
    <View style={styles.wrapper}>
      <GrinderSearchField value={catalog.search} onChange={catalog.setSearch} />
      <View style={styles.list}>
        <GrinderList
          items={catalog.items}
          isLoading={catalog.isLoading}
          isError={catalog.isError}
          isFiltered={catalog.isFiltered}
          onRetry={catalog.refetch}
          onAddOwn={openSheet}
          onSelect={onSelect}
        />
      </View>
      <Button
        label={t(TRANSLATION_KEYS.grinderNotFoundAction)}
        variant="tertiary"
        fullWidth
        onPress={openSheet}
      />
      <AddGrinderSheet
        visible={adding}
        onClose={(): void => {
          setAdding(false);
        }}
        onAdded={(grinder: Grinder): void => {
          setAdding(false);
          onSelect(grinder);
        }}
      />
    </View>
  );
};
