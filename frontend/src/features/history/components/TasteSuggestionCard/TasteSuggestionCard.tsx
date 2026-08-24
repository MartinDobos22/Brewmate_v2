import { INSIGHT_EXPLANATION_SOURCES, type TasteSuggestion } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ROAST_LEVEL_LABEL_KEYS } from '../../../tasteProfile/constants';
import { useAcceptTasteSuggestion, useDismissTasteSuggestion } from '../../hooks';
import { describeSuggestion } from '../../services';

import { createTasteSuggestionStyles } from './TasteSuggestionCard.styles';

const NOTHING = 0;

export interface TasteSuggestionCardProps {
  readonly suggestion: TasteSuggestion;
  readonly brewCount: number;
}

/**
 * What the history proposes, offered rather than applied.
 *
 * Nothing on this card is written anywhere until somebody taps. It is a
 * conclusion drawn from what a person reached for, not from anything they
 * said, and the text says so - an app that quietly rewrote a profile from
 * behaviour would be arguing with somebody about their own taste without
 * telling them.
 *
 * The line about who wrote the paragraph is printed whenever the phone did,
 * for the same reason the shop verdict admits its offline fallback: the
 * numbers are the same either way, and the reader is entitled to know which
 * kind of sentence they are reading.
 */
export const TasteSuggestionCard = ({
  suggestion,
  brewCount,
}: TasteSuggestionCardProps): JSX.Element => {
  const styles = useThemedStyles(createTasteSuggestionStyles);
  const { t } = useTranslation();
  const accept = useAcceptTasteSuggestion();
  const dismiss = useDismissTasteSuggestion();

  const notes = Object.keys(suggestion.flavorAffinities);
  const busy = accept.isPending || dismiss.isPending;

  return (
    <Card variant="container">
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.suggestionTitle)}</Text>

      <View style={styles.body}>
        <Text variant="bodyMedium">{describeSuggestion(suggestion, brewCount, t)}</Text>
      </View>

      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.suggestionChangesTitle)}
      </Text>
      <View style={styles.changes}>
        {suggestion.roastPreference === null ? null : (
          <Text variant="bodySmall">
            {t(TRANSLATION_KEYS.suggestionChangeRoast, {
              value: t(ROAST_LEVEL_LABEL_KEYS[suggestion.roastPreference]),
            })}
          </Text>
        )}
        {notes.length === NOTHING ? null : (
          <Text variant="bodySmall">
            {t(TRANSLATION_KEYS.suggestionChangeNotes, {
              values: notes.join(t(TRANSLATION_KEYS.suggestionSeparator)),
            })}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          label={t(TRANSLATION_KEYS.suggestionAccept)}
          variant="primary"
          disabled={busy}
          onPress={(): void => {
            accept.mutate(suggestion.ref);
          }}
        />
        <Button
          label={t(TRANSLATION_KEYS.suggestionDismiss)}
          variant="secondary"
          disabled={busy}
          onPress={(): void => {
            dismiss.mutate(suggestion.ref);
          }}
        />
      </View>

      {suggestion.explanationSource === INSIGHT_EXPLANATION_SOURCES.rules ? (
        <View style={styles.source}>
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.suggestionWrittenByPhone)}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};
