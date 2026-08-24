import type { BrewConstraintName, Equipment } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Input, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_CONSTRAINT_OPTIONS, type BrewConstraintOption } from '../../../brewing/constants';
import { EQUIPMENT_SET_NAME_SUGGESTION_KEYS } from '../../constants';
import { equipmentDisplayName, type EquipmentSetFormValues } from '../../services';

import { createEquipmentSetFormStyles } from './EquipmentSetForm.styles';

export interface EquipmentSetFormFieldsProps {
  readonly values: EquipmentSetFormValues;
  readonly equipment: readonly Equipment[];
  readonly disabled: boolean;
  readonly onChange: (patch: Partial<EquipmentSetFormValues>) => void;
  readonly onToggleItem: (equipmentId: string) => void;
  readonly onToggleConstraint: (flag: BrewConstraintName) => void;
}

/** Name it, say what is in it, and say what that place is usually missing. */
export const EquipmentSetFormFields = ({
  values,
  equipment,
  disabled,
  onChange,
  onToggleItem,
  onToggleConstraint,
}: EquipmentSetFormFieldsProps): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSetFormStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.field}>
        <Input
          label={t(TRANSLATION_KEYS.setupSetsNameLabel)}
          placeholder={t(TRANSLATION_KEYS.setupSetsNamePlaceholder)}
          value={values.name}
          disabled={disabled}
          onChangeText={(name: string): void => {
            onChange({ name });
          }}
        />
        <View style={styles.row}>
          {EQUIPMENT_SET_NAME_SUGGESTION_KEYS.map((key: TranslationKey): JSX.Element => (
            <Chip
              key={key}
              label={t(key)}
              disabled={disabled}
              selected={values.name === t(key)}
              onPress={(): void => {
                onChange({ name: t(key) });
              }}
            />
          ))}
        </View>
      </View>
      <View style={styles.field}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.setupSetsItemsLabel)}
        </Text>
        <View style={styles.row}>
          {equipment.map((item: Equipment): JSX.Element => (
            <Chip
              key={item.id}
              label={equipmentDisplayName(item, t(TRANSLATION_KEYS.profileEquipmentUnnamed))}
              selected={values.equipmentIds.includes(item.id)}
              disabled={disabled}
              onPress={(): void => {
                onToggleItem(item.id);
              }}
            />
          ))}
        </View>
      </View>
      <View style={styles.field}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.setupSetsConstraintsLabel)}
        </Text>
        <View style={styles.row}>
          {BREW_CONSTRAINT_OPTIONS.map((option: BrewConstraintOption): JSX.Element => (
            <Chip
              key={option.name}
              label={t(option.labelKey)}
              selected={values.constraints[option.name] === true}
              disabled={disabled}
              onPress={(): void => {
                onToggleConstraint(option.name);
              }}
            />
          ))}
        </View>
      </View>
      <Chip
        label={t(TRANSLATION_KEYS.setupSetsDefaultLabel)}
        selected={values.isDefault}
        disabled={disabled}
        onPress={(): void => {
          onChange({ isDefault: !values.isDefault });
        }}
      />
    </View>
  );
};
