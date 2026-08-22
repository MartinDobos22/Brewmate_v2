import { useState, type JSX } from 'react';
import { ScrollView } from 'react-native';

import type { Grinder } from '@brewmate/shared';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { EMPTY_GRINDER_FORM } from '../../constants';
import { useCreateGrinder } from '../../hooks';
import {
  hasGrinderFormError,
  resolveGrinderErrorKey,
  toCreateGrinderRequest,
  validateGrinderForm,
  NO_GRINDER_FORM_ERRORS,
  type GrinderFormValues,
} from '../../services';
import { GrinderFormFields } from '../GrinderFormFields';

import { createAddGrinderFormStyles } from './AddGrinderForm.styles';

export interface AddGrinderFormProps {
  /** Handed the entry the API created, so the caller can close and select it. */
  readonly onAdded: (grinder: Grinder) => void;
}

/**
 * Contributes a grinder the catalogue is missing.
 *
 * The entry is saved unverified and against this account, so it appears in
 * nobody else's picker until somebody checks it - which is why the form can
 * afford to trust what is typed here.
 */
export const AddGrinderForm = ({ onAdded }: AddGrinderFormProps): JSX.Element => {
  const styles = useThemedStyles(createAddGrinderFormStyles);
  const { t } = useTranslation();
  const [values, setValues] = useState<GrinderFormValues>(EMPTY_GRINDER_FORM);
  const [errors, setErrors] = useState(NO_GRINDER_FORM_ERRORS);
  const mutation = useCreateGrinder();
  const errorKey = resolveGrinderErrorKey(mutation.error);

  const submit = (): void => {
    const found = validateGrinderForm(values);

    setErrors(found);

    if (hasGrinderFormError(found)) {
      return;
    }

    mutation.mutate(toCreateGrinderRequest(values), {
      onSuccess: (grinder: Grinder): void => {
        setValues(EMPTY_GRINDER_FORM);
        setErrors(NO_GRINDER_FORM_ERRORS);
        onAdded(grinder);
      },
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.form}
      keyboardShouldPersistTaps="handled"
    >
      <GrinderFormFields
        values={values}
        errors={errors}
        disabled={mutation.isPending}
        onChange={(patch: Partial<GrinderFormValues>): void => {
          setValues({ ...values, ...patch });
        }}
      />
      {errorKey === null ? null : (
        <Text variant="bodySmall" tone="error">
          {t(errorKey)}
        </Text>
      )}
      <Button
        label={t(TRANSLATION_KEYS.grinderAddSubmit)}
        onPress={submit}
        loading={mutation.isPending}
        fullWidth
      />
    </ScrollView>
  );
};
