import type { CoffeeBag } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { ScrollView } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { useRequestErrorCopy } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useCreateCoffeeBag } from '../../hooks';
import {
  EMPTY_COFFEE_BAG_FORM,
  toCreateCoffeeBagRequest,
  type CoffeeBagFormValues,
} from '../../services/coffeeBagForm';
import { CoffeeBagFormFields } from '../CoffeeBagFormFields';

import { createAddCoffeeBagFormStyles } from './AddCoffeeBagForm.styles';

export interface AddCoffeeBagFormProps {
  readonly onAdded: (bag: CoffeeBag) => void;
}

/**
 * Writing a bag down by hand.
 *
 * Only the name matters, and even that has a fallback - somebody adding the
 * coffee they are about to brew should not be stopped by a required field they
 * would have to invent an answer for.
 */
export const AddCoffeeBagForm = ({ onAdded }: AddCoffeeBagFormProps): JSX.Element => {
  const styles = useThemedStyles(createAddCoffeeBagFormStyles);
  const { t } = useTranslation();
  const [values, setValues] = useState<CoffeeBagFormValues>(EMPTY_COFFEE_BAG_FORM);
  const mutation = useCreateCoffeeBag();
  const errorCopy = useRequestErrorCopy(mutation.error);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.form}
      keyboardShouldPersistTaps="handled"
    >
      <CoffeeBagFormFields
        values={values}
        disabled={mutation.isPending}
        onChange={(patch: Partial<CoffeeBagFormValues>): void => {
          setValues({ ...values, ...patch });
        }}
      />
      {mutation.isError ? (
        <Text variant="bodySmall" tone="error">
          {errorCopy.description}
        </Text>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.inventoryAddSubmit)}
        fullWidth
        loading={mutation.isPending}
        onPress={(): void => {
          mutation.mutate(
            toCreateCoffeeBagRequest(values, t(TRANSLATION_KEYS.inventoryUnnamedCoffee)),
            {
              onSuccess: (bag: CoffeeBag): void => {
                setValues(EMPTY_COFFEE_BAG_FORM);
                onAdded(bag);
              },
            },
          );
        }}
      />
    </ScrollView>
  );
};
