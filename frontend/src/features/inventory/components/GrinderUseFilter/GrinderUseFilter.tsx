import type { JSX } from 'react';
import { View } from 'react-native';

import type { GrinderTypicalUse } from '@brewmate/shared';

import { Chip } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { GRINDER_USE_FILTER_ORDER, GRINDER_USE_LABEL_KEYS } from '../../constants';

import { createGrinderUseFilterStyles } from './GrinderUseFilter.styles';

export interface GrinderUseFilterProps {
  /** `null` is the unfiltered catalogue, not a fourth kind of grinder. */
  readonly selected: GrinderTypicalUse | null;
  readonly onSelect: (typicalUse: GrinderTypicalUse | null) => void;
}

/** Narrows the catalogue to what a grinder is built for. */
export const GrinderUseFilter = ({ selected, onSelect }: GrinderUseFilterProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderUseFilterStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Chip
        label={t(TRANSLATION_KEYS.grinderFilterAll)}
        selected={selected === null}
        onPress={(): void => {
          onSelect(null);
        }}
      />
      {GRINDER_USE_FILTER_ORDER.map((typicalUse: GrinderTypicalUse): JSX.Element => (
        <Chip
          key={typicalUse}
          label={t(GRINDER_USE_LABEL_KEYS[typicalUse])}
          selected={selected === typicalUse}
          onPress={(): void => {
            onSelect(typicalUse);
          }}
        />
      ))}
    </View>
  );
};
