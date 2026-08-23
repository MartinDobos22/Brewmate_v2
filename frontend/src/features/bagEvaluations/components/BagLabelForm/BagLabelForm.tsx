import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { CoffeeBagFormFields } from '../../../inventory/components';
import { BAG_SCAN_MODES } from '../../constants/bagScan';
import type { BagScan } from '../../hooks/useBagScan';

const NOTHING = 0;

export interface BagLabelFormProps {
  readonly scan: BagScan;
}

/**
 * The label, as far as anybody can be bothered to check it.
 *
 * Nothing is required. A bag with only a roast level still gets an answer, and
 * a bag with nothing on it at all gets an honest "toto ti nepoviem" - which is
 * better than an app that refuses to talk until the form is full.
 *
 * What a camera read badly is marked rather than corrected. The app does not
 * know better than the person holding the bag; it only knows which boxes it
 * squinted at, and saying so is the difference between a form somebody skims
 * and one they actually check.
 */
export const BagLabelForm = ({ scan }: BagLabelFormProps): JSX.Element => {
  const { t } = useTranslation();
  const hasUncertainFields = scan.unverified.length > NOTHING;

  return (
    <>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanLabelTitle)}</Text>
      <Text variant="bodySmall" tone={hasUncertainFields ? 'tertiary' : 'muted'}>
        {t(
          hasUncertainFields
            ? TRANSLATION_KEYS.scanLabelCheckUncertain
            : TRANSLATION_KEYS.scanLabelTypeItIn,
        )}
      </Text>
      {scan.photo.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.scanPhotoFailed)}
        </Text>
      ) : null}
      <CoffeeBagFormFields
        values={scan.label}
        unverified={scan.unverified}
        disabled={scan.isSaving}
        onChange={scan.describeLabel}
      />
      {scan.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.scanError)}
        </Text>
      ) : null}
      <Button
        label={t(
          scan.mode === BAG_SCAN_MODES.inventory
            ? TRANSLATION_KEYS.inventoryAddSubmit
            : TRANSLATION_KEYS.scanSubmit,
        )}
        fullWidth
        loading={scan.isSaving}
        onPress={(): void => {
          scan.submit(t(TRANSLATION_KEYS.inventoryUnnamedCoffee));
        }}
      />
    </>
  );
};
