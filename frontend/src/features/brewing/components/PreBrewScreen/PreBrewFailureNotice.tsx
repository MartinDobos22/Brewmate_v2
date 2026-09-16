import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { readErrorReference, resolveRequestErrorKeys } from '../../../../lib/requestErrors';
import { useThemedStyles } from '../../../../theme';

import { createPreBrewScreenStyles } from './PreBrewScreen.styles';

export interface PreBrewFailureNoticeProps {
  readonly error: unknown;
  readonly isOnline: boolean;
}

/**
 * Why the recipe was not written, in the words of whatever actually refused.
 *
 * It used to be one sentence - "Recept sa nepodarilo napísať, skús to prosím
 * znova" - printed for every failure there is. A spent model allowance, a
 * token that had expired, a brewing method that had been retired, a body the
 * contract rejected and a provider that never answered all produced the same
 * red line and the same useless advice, and "skús to znova" is actively wrong
 * for three of the five. `resolveRequestErrorKeys` already owns that mapping
 * for the rest of the app; this is the same map, on the one screen that was
 * still guessing.
 *
 * Under it, the code and the request id. Nobody reads them on a good day, and
 * on a bad one they are the only thing that turns "it did not work" into a
 * line in the server log - which is the entire difference between a bug that
 * gets fixed and one that gets described.
 */
export const PreBrewFailureNotice = ({
  error,
  isOnline,
}: PreBrewFailureNoticeProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewScreenStyles);
  const { t } = useTranslation();
  const keys = resolveRequestErrorKeys(error, isOnline);
  const reference = readErrorReference(error);

  return (
    <View style={styles.failure}>
      <Text variant="bodyMedium" tone="error">
        {t(keys.titleKey)}
      </Text>
      <Text variant="bodySmall" tone="muted">
        {t(keys.bodyKey, keys.bodyValues)}
      </Text>
      {reference === null ? null : (
        <Text variant="bodySmall" tone="tertiary" numeric>
          {t(
            reference.requestId === null
              ? TRANSLATION_KEYS.preBrewErrorCode
              : TRANSLATION_KEYS.preBrewErrorReference,
            { code: reference.code, requestId: reference.requestId ?? '' },
          )}
        </Text>
      )}
    </View>
  );
};
