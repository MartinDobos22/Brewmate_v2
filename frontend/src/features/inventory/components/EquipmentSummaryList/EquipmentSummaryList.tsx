import type { Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EQUIPMENT_TYPE_LABEL_KEYS } from '../../constants';
import { equipmentDisplayName } from '../../services';

import { createEquipmentSummaryListStyles } from './EquipmentSummaryList.styles';

export interface EquipmentSummaryListProps {
  readonly items: readonly Equipment[];
  readonly emptyText: string;
  /** Left out, the list is read-only. */
  readonly onRemove?: (equipmentId: string) => void;
}

const NOTHING = 0;

/** What the user owns, as one line each. Used by onboarding and by the profile. */
export const EquipmentSummaryList = ({
  items,
  emptyText,
  onRemove,
}: EquipmentSummaryListProps): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSummaryListStyles);
  const { t } = useTranslation();

  if (items.length === NOTHING) {
    return (
      <Text variant="bodySmall" tone="muted">
        {emptyText}
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      {items.map((item: Equipment): JSX.Element => (
        <ListItem
          key={item.id}
          title={equipmentDisplayName(item, t(TRANSLATION_KEYS.profileEquipmentUnnamed))}
          subtitle={t(EQUIPMENT_TYPE_LABEL_KEYS[item.type])}
          trailing={
            onRemove === undefined ? undefined : (
              <Button
                label={t(TRANSLATION_KEYS.profileEquipmentRemove)}
                variant="tertiary"
                size="small"
                onPress={(): void => {
                  onRemove(item.id);
                }}
              />
            )
          }
        />
      ))}
    </View>
  );
};
