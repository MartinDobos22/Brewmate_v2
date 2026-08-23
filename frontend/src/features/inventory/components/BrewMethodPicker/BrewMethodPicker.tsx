import type { BrewMethod, Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { LoadingState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BrewerSelection } from '../../hooks';
import { groupMethodsByCategory, type BrewMethodGroup } from '../../services';
import { BrewMethodGroupSection } from '../BrewMethodGroupSection';

import { createBrewMethodPickerStyles } from './BrewMethodPicker.styles';

export interface BrewMethodPickerProps {
  readonly selection: BrewerSelection;
  readonly onOpenDetails: (method: BrewMethod, brewer: Equipment) => void;
}

/**
 * Every method that needs a piece of gear, grouped by family.
 *
 * Eighteen methods in one flat list is a wall; the same eighteen under six
 * headings is a cupboard somebody can recognise their own in.
 */
export const BrewMethodPicker = ({
  selection,
  onOpenDetails,
}: BrewMethodPickerProps): JSX.Element => {
  const styles = useThemedStyles(createBrewMethodPickerStyles);
  const { t } = useTranslation();

  if (selection.isLoading) {
    return <LoadingState label={t(TRANSLATION_KEYS.setupBrewersLoading)} />;
  }

  if (selection.isError) {
    return (
      <Text variant="bodyMedium" tone="error">
        {t(TRANSLATION_KEYS.setupBrewersError)}
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      {groupMethodsByCategory(selection.methods).map((group: BrewMethodGroup): JSX.Element => (
        <BrewMethodGroupSection
          key={group.category}
          group={group}
          selection={selection}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </View>
  );
};
