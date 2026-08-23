import type { JSX } from 'react';

import { useRequestErrorCopy } from '../../../hooks/useRequestErrorCopy';
import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { ErrorState } from '../ErrorState';
import { LoadingState } from '../LoadingState';

export interface QueryStateProps {
  readonly isPending: boolean;
  readonly isError: boolean;
  readonly error?: unknown;
  readonly onRetry: () => void;
  /** Overrides the default "Načítava sa…" where a screen can say more. */
  readonly loadingLabel?: string;
}

/**
 * The waiting room every screen shares.
 *
 * One component rather than three copies of the same branch, because the two
 * states it covers are exactly the ones that otherwise become a blank screen:
 * a query that has not answered yet, and one that failed. The failure always
 * carries a retry, and never carries a code.
 */
export const QueryState = ({
  isPending,
  isError,
  error,
  onRetry,
  loadingLabel,
}: QueryStateProps): JSX.Element | null => {
  const { t } = useTranslation();
  const copy = useRequestErrorCopy(error);

  if (isPending) {
    return <LoadingState label={loadingLabel ?? t(TRANSLATION_KEYS.stateLoading)} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={copy.title}
        description={copy.description}
        retryLabel={t(TRANSLATION_KEYS.actionRetry)}
        onRetry={onRetry}
      />
    );
  }

  return null;
};
