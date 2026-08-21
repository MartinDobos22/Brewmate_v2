import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';

export interface AuthErrorMessageProps {
  /** Null renders nothing, so a screen can pass its error state straight in. */
  readonly errorKey: TranslationKey | null;
}

/** The one place a failed sign-in is put on screen, always in Slovak. */
export const AuthErrorMessage = ({ errorKey }: AuthErrorMessageProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (errorKey === null) {
    return null;
  }

  return (
    <Text variant="bodySmall" tone="error" accessibilityLabel={t(errorKey)}>
      {t(errorKey)}
    </Text>
  );
};
