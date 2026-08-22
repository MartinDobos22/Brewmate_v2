import type { EquipmentSet } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useEquipmentSetSwitcher } from '../../hooks';

import { createEquipmentSetSwitcherStyles } from './EquipmentSetSwitcher.styles';

const NOTHING = 0;

/**
 * "Kde dnes varíš?", answered in one tap.
 *
 * Belongs above the brew screen because that is the moment the answer changes:
 * the same person brews on different gear at home and at the cabin, and the
 * recipe they are about to be given depends on which.
 */
export const EquipmentSetSwitcher = (): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSetSwitcherStyles);
  const { t } = useTranslation();
  const switcher = useEquipmentSetSwitcher();

  return (
    <View style={styles.wrapper}>
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.brewSetSwitcherTitle)}
      </Text>
      {switcher.sets.length === NOTHING ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.brewSetSwitcherEmpty)}
        </Text>
      ) : (
        <View style={styles.row}>
          {switcher.sets.map((set: EquipmentSet): JSX.Element => (
            <Chip
              key={set.id}
              label={set.name}
              selected={set.isDefault}
              disabled={switcher.isPending}
              onPress={(): void => {
                switcher.makeDefault(set.id);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
