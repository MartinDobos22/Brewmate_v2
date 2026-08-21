import type { TranslationKey } from '../../../i18n';

import { useAuthMutation, type AuthMutation } from './useAuthMutation';

/** An authentication action that needs nothing from the screen to run. */
export type AuthAction = Omit<AuthMutation<undefined>, 'run'> & {
  readonly run: () => void;
};

/**
 * The input-free half of `useAuthMutation`: signing out, resending a
 * verification e-mail, deleting the account. Screens hand `run` straight to a
 * button.
 */
export const useAuthAction = (
  action: () => Promise<void>,
  fallbackErrorKey?: TranslationKey,
): AuthAction => {
  const { run, ...state } = useAuthMutation<undefined>(action, fallbackErrorKey);

  return {
    ...state,
    run: (): void => {
      run(undefined);
    },
  };
};
