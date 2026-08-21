import type { JSX } from 'react';

import { ROUTES } from '../../../../constants';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useAuthMutation } from '../../hooks';
import { signInWithEmail } from '../../services';
import { AuthNavigationLink } from '../AuthNavigationLink';
import { AuthScreenLayout } from '../AuthScreenLayout';
import { EmailPasswordForm } from '../EmailPasswordForm';
import { SocialAuthButtons } from '../SocialAuthButtons';

/** Signing in with any of the three methods the app supports. */
export const SignInScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const { run, isPending, errorKey } = useAuthMutation(signInWithEmail);

  return (
    <AuthScreenLayout
      title={t(TRANSLATION_KEYS.authSignInTitle)}
      subtitle={t(TRANSLATION_KEYS.authSignInSubtitle)}
    >
      <EmailPasswordForm
        submitLabel={t(TRANSLATION_KEYS.authSignInAction)}
        onSubmit={run}
        isPending={isPending}
        errorKey={errorKey}
        disabled={!isOnline}
        footer={
          <AuthNavigationLink
            action={t(TRANSLATION_KEYS.authForgotPasswordAction)}
            href={ROUTES.forgotPassword}
          />
        }
      />
      <SocialAuthButtons disabled={!isOnline} />
      <AuthNavigationLink
        question={t(TRANSLATION_KEYS.authNoAccountQuestion)}
        action={t(TRANSLATION_KEYS.authGoToSignUp)}
        href={ROUTES.signUp}
      />
    </AuthScreenLayout>
  );
};
