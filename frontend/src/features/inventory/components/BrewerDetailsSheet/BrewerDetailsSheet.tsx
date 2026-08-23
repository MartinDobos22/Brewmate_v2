import type { BrewMethod, Equipment } from '@brewmate/shared';
import { useState, type JSX } from 'react';
import { ScrollView } from 'react-native';

import { Button, Sheet } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useUpdateEquipment } from '../../hooks';
import {
  hasBrewerDetailsError,
  readBrewerDetailsValues,
  toBrewerParams,
  validateBrewerDetails,
  NO_BREWER_DETAILS_ERRORS,
  type BrewerDetailsErrors,
  type BrewerDetailsValues,
} from '../../services';

import { BrewerDetailsFields } from './BrewerDetailsFields';
import { createBrewerDetailsSheetStyles } from './BrewerDetailsSheet.styles';

export interface BrewerDetailsSheetProps {
  readonly visible: boolean;
  readonly method: BrewMethod;
  readonly brewer: Equipment;
  readonly onClose: () => void;
}

/**
 * The measurements behind a ticked method.
 *
 * Everything here may be left blank. A brewer nobody measured is still a
 * brewer, and Brewmate would rather say "I do not know your kettle's capacity"
 * than assume a number and quietly recommend a dose that overflows it.
 */
export const BrewerDetailsSheet = ({
  visible,
  method,
  brewer,
  onClose,
}: BrewerDetailsSheetProps): JSX.Element => {
  const styles = useThemedStyles(createBrewerDetailsSheetStyles);
  const { t } = useTranslation();
  const update = useUpdateEquipment();
  const [values, setValues] = useState<BrewerDetailsValues>((): BrewerDetailsValues =>
    readBrewerDetailsValues(brewer),
  );
  const [errors, setErrors] = useState<BrewerDetailsErrors>(NO_BREWER_DETAILS_ERRORS);

  const submit = (): void => {
    const found = validateBrewerDetails(values);

    setErrors(found);

    if (hasBrewerDetailsError(found)) {
      return;
    }

    update.mutate(
      { id: brewer.id, changes: { params: toBrewerParams(values, method.id) } },
      { onSuccess: onClose },
    );
  };

  return (
    <Sheet
      visible={visible}
      title={t(TRANSLATION_KEYS.setupBrewerDetailTitle)}
      closeLabel={t(TRANSLATION_KEYS.actionClose)}
      onClose={onClose}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.form}>
        <BrewerDetailsFields
          values={values}
          errors={errors}
          category={method.category}
          disabled={update.isPending}
          onChange={(patch: Partial<BrewerDetailsValues>): void => {
            setValues((current: BrewerDetailsValues): BrewerDetailsValues => ({
              ...current,
              ...patch,
            }));
          }}
        />
        <Button
          label={t(TRANSLATION_KEYS.setupBrewerDetailSave)}
          onPress={submit}
          loading={update.isPending}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
};
