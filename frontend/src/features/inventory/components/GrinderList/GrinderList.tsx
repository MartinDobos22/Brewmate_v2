import type { JSX } from 'react';
import { FlatList, type ListRenderItemInfo } from 'react-native';

import type { Grinder } from '@brewmate/shared';

import { EmptyState, ErrorState, LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { GrinderListItem } from '../GrinderListItem';

import { createGrinderListStyles } from './GrinderList.styles';

export interface GrinderListProps {
  readonly items: readonly Grinder[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  /** Whether a search or a filter is narrowing the list right now. */
  readonly isFiltered: boolean;
  readonly onRetry: () => void;
  readonly onAddOwn: () => void;
  /** Turns the list into a picker. Left out, the entries are read-only. */
  readonly onSelect?: (grinder: Grinder) => void;
}

const NOTHING = 0;

/**
 * The catalogue itself, with the four states it can be in. The empty one is
 * the interesting case: not finding a grinder is the normal way into adding
 * it, so the way out is offered right there.
 */
export const GrinderList = ({
  items,
  isLoading,
  isError,
  isFiltered,
  onRetry,
  onAddOwn,
  onSelect,
}: GrinderListProps): JSX.Element => {
  const styles = useThemedStyles(createGrinderListStyles);
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState label={t(TRANSLATION_KEYS.grinderLoadingLabel)} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t(TRANSLATION_KEYS.grinderErrorTitle)}
        description={t(TRANSLATION_KEYS.grinderErrorBody)}
        retryLabel={t(TRANSLATION_KEYS.actionRetry)}
        onRetry={onRetry}
      />
    );
  }

  if (items.length === NOTHING) {
    return (
      <EmptyState
        title={t(
          isFiltered ? TRANSLATION_KEYS.grinderNoResultsTitle : TRANSLATION_KEYS.grinderEmptyTitle,
        )}
        description={t(
          isFiltered ? TRANSLATION_KEYS.grinderNoResultsBody : TRANSLATION_KEYS.grinderEmptyBody,
        )}
        actionLabel={t(TRANSLATION_KEYS.grinderNotFoundAction)}
        onAction={onAddOwn}
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(grinder: Grinder): string => grinder.id}
      renderItem={({ item }: ListRenderItemInfo<Grinder>): JSX.Element => (
        <GrinderListItem grinder={item} onPress={onSelect} />
      )}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
};
