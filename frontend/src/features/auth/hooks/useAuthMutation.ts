import { useMutation } from '@tanstack/react-query';

import type { TranslationKey } from '../../../i18n';
import { resolveAuthErrorKey } from '../services/resolveAuthErrorKey';

export interface AuthMutation<TInput> {
  readonly run: (input: TInput) => void;
  readonly isPending: boolean;
  /** True once the action has completed without an error. */
  readonly isSuccess: boolean;
  /** The Slovak message to show, or null while nothing has gone wrong. */
  readonly errorKey: TranslationKey | null;
  readonly clearError: () => void;
}

/**
 * Runs one authentication action and reports it the way a screen needs it:
 * pending or not, and a translated message instead of a provider error.
 */
export const useAuthMutation = <TInput>(
  action: (input: TInput) => Promise<void>,
  fallbackErrorKey?: TranslationKey,
): AuthMutation<TInput> => {
  // The generics are inferred from `action`: void data, TInput variables.
  const mutation = useMutation({ mutationFn: action });

  return {
    run: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    errorKey:
      mutation.error === null ? null : resolveAuthErrorKey(mutation.error, fallbackErrorKey),
    clearError: mutation.reset,
  };
};
