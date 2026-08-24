import type { Equipment } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BrewConstraintName } from '@brewmate/shared';

import { EMPTY_EQUIPMENT_SET_FORM } from '../../constants';
import { useCreateEquipmentSet } from '../../hooks';
import {
  toCreateEquipmentSetRequest,
  toggleConstraint,
  toggleEquipmentId,
  validateEquipmentSetForm,
  type EquipmentSetFormValues,
} from '../../services';

import { createEquipmentSetFormStyles } from './EquipmentSetForm.styles';
import { EquipmentSetFormFields } from './EquipmentSetFormFields';

export interface EquipmentSetFormProps {
  readonly equipment: readonly Equipment[];
}

/**
 * Saves a named combination of gear the user already owns.
 *
 * Nothing here creates equipment: a set is a selection, so the same grinder
 * can be in "Domov" and in "Práca" without becoming two grinders.
 */
export const EquipmentSetForm = ({ equipment }: EquipmentSetFormProps): JSX.Element => {
  const styles = useThemedStyles(createEquipmentSetFormStyles);
  const { t } = useTranslation();
  const create = useCreateEquipmentSet();
  const [values, setValues] = useState<EquipmentSetFormValues>(EMPTY_EQUIPMENT_SET_FORM);
  const [error, setError] = useState<TranslationKey | null>(null);

  const patch = (changes: Partial<EquipmentSetFormValues>): void => {
    setValues((current: EquipmentSetFormValues): EquipmentSetFormValues => ({
      ...current,
      ...changes,
    }));
  };

  const submit = (): void => {
    const found = validateEquipmentSetForm(values);

    setError(found);

    if (found !== null) {
      return;
    }

    create.mutate(toCreateEquipmentSetRequest(values), {
      onSuccess: (): void => {
        setValues(EMPTY_EQUIPMENT_SET_FORM);
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <EquipmentSetFormFields
        values={values}
        equipment={equipment}
        disabled={create.isPending}
        onChange={patch}
        onToggleItem={(equipmentId: string): void => {
          patch({ equipmentIds: toggleEquipmentId(values.equipmentIds, equipmentId) });
        }}
        onToggleConstraint={(flag: BrewConstraintName): void => {
          patch({ constraints: toggleConstraint(values.constraints, flag) });
        }}
      />
      {error === null ? null : (
        <Text variant="bodySmall" tone="error">
          {t(error)}
        </Text>
      )}
      {create.isError ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.setupErrorSaveFailed)}
        </Text>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.setupSetsAddAction)}
        onPress={submit}
        loading={create.isPending}
        fullWidth
      />
    </View>
  );
};
