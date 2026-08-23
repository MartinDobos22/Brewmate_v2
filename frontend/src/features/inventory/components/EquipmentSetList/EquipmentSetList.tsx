import type { EquipmentSet } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useEquipmentSetSwitcher } from '../../hooks';

import { createEquipmentSetListStyles } from './EquipmentSetList.styles';

const NOTHING = 0;

/** The saved sets, with the one that is currently default marked as such. */
export const EquipmentSetList = (): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSetListStyles);
  const { t } = useTranslation();
  const switcher = useEquipmentSetSwitcher();

  if (switcher.sets.length === NOTHING) {
    return (
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.setupSetsEmptyNotice)}
      </Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      {switcher.sets.map((set: EquipmentSet): JSX.Element => (
        <ListItem
          key={set.id}
          title={set.name}
          subtitle={set.isDefault ? t(TRANSLATION_KEYS.setupSetsDefaultBadge) : undefined}
          trailing={
            set.isDefault ? undefined : (
              <Button
                label={t(TRANSLATION_KEYS.setupSetsMakeDefault)}
                variant="tertiary"
                size="small"
                onPress={(): void => {
                  switcher.makeDefault(set.id);
                }}
              />
            )
          }
        />
      ))}
    </View>
  );
};
