import type { JSX } from 'react';

import { ROUTES } from '../../../../constants';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useAuthMutation } from '../../hooks';
import { signUpWithEmail } from '../../services';
import { AuthNavigationLink } from '../AuthNavigationLink';
import { AuthScreenLayout } from '../AuthScreenLayout';
import { EmailPasswordForm } from '../EmailPasswordForm';
import { SocialAuthButtons } from '../SocialAuthButtons';

/**
 * Registering. Google and Apple appear here too: with them, signing in and
 * signing up are the same act, so a new user reaches the app either way.
 */
export const SignUpScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const { run, isPending, errorKey } = useAuthMutation(signUpWithEmail);

  return (
    <AuthScreenLayout
      title={t(TRANSLATION_KEYS.authSignUpTitle)}
      subtitle={t(TRANSLATION_KEYS.authSignUpSubtitle)}
    >
      <EmailPasswordForm
        submitLabel={t(TRANSLATION_KEYS.authSignUpAction)}
        onSubmit={run}
        isPending={isPending}
        errorKey={errorKey}
        disabled={!isOnline}
      />
      <SocialAuthButtons disabled={!isOnline} />
      <AuthNavigationLink
        question={t(TRANSLATION_KEYS.authHasAccountQuestion)}
        action={t(TRANSLATION_KEYS.authGoToSignIn)}
        href={ROUTES.signIn}
      />
    </AuthScreenLayout>
  );
};
