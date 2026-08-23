import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { CoffeeBagFormFields } from '../../../inventory/components';
import type { CoffeeBagFormValues } from '../../../inventory/services';
import type { BagScan } from '../../hooks/useBagScan';

export interface BagLabelFormProps {
  readonly scan: BagScan;
}

/**
 * The label, as far as anybody can be bothered to type it in a shop.
 *
 * Nothing is required. A bag with only a roast level still gets an answer, and
 * a bag with nothing on it at all gets an honest "toto ti nepoviem" - which is
 * better than an app that refuses to talk until the form is full.
 */
export const BagLabelForm = ({ scan }: BagLabelFormProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanLabelTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanPhotoNote)}
      </Text>
      <CoffeeBagFormFields
        values={scan.label}
        onChange={(patch: Partial<CoffeeBagFormValues>): void => {
          scan.describeLabel(patch);
        }}
        disabled={scan.isPending}
      />
      <Button label={t(TRANSLATION_KEYS.scanSubmit)} fullWidth onPress={scan.ask} />
    </>
  );
};
