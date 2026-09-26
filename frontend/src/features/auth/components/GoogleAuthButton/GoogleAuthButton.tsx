import type { JSX } from 'react';

import { PillButton } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AUTH_ICONS } from '../../constants';
import { useGoogleSignIn } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';

export interface GoogleAuthButtonProps {
  readonly disabled?: boolean;
}

/**
 * Only rendered when the OAuth client IDs are configured - the hook that backs
 * it refuses to build a request without them.
 */
export const GoogleAuthButton = ({ disabled = false }: GoogleAuthButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const { signIn, isPending, errorKey, ready } = useGoogleSignIn();

  return (
    <>
      <PillButton
        tone="lifted"
        icon={AUTH_ICONS.google}
        label={t(TRANSLATION_KEYS.authGoogleAction)}
        onPress={signIn}
        isPending={isPending}
        disabled={disabled || !ready}
      />
      <AuthErrorMessage errorKey={errorKey} />
    </>
  );
};
