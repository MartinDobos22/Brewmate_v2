import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { INSIGHT_EXPLANATION_SOURCES, type TasteSuggestion } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { ROAST_LEVEL_LABEL_KEYS } from '../../../tasteProfile/constants';
import { SUGGESTION_ICONS } from '../../constants';
import { useAcceptTasteSuggestion, useDismissTasteSuggestion } from '../../hooks';
import { describeSuggestion } from '../../services';

import { SuggestionAnswer } from './SuggestionAnswer';
import { SuggestionChange } from './SuggestionChange';
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
  const theme = useTheme();
  const { t } = useTranslation();
  const accept = useAcceptTasteSuggestion();
  const dismiss = useDismissTasteSuggestion();

  const notes = Object.keys(suggestion.flavorAffinities);
  const busy = accept.isPending || dismiss.isPending;

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={SUGGESTION_ICONS.heading}
          size={theme.size.iconLarge}
          color={theme.colors.accentOnEspresso}
        />
        <View style={styles.title}>
          <Text variant="sectionHeading" tone="onEspresso">
            {t(TRANSLATION_KEYS.suggestionTitle)}
          </Text>
        </View>
      </View>

      <Text variant="bodyLead" tone="onEspresso">
        {describeSuggestion(suggestion, brewCount, t)}
      </Text>

      <View style={styles.changes}>
        <Text variant="eyebrow" tone="onEspressoMuted">
          {t(TRANSLATION_KEYS.suggestionChangesTitle)}
        </Text>
        {suggestion.roastPreference === null ? null : (
          <SuggestionChange
            icon={SUGGESTION_ICONS.roast}
            text={t(TRANSLATION_KEYS.suggestionChangeRoast, {
              value: t(ROAST_LEVEL_LABEL_KEYS[suggestion.roastPreference]),
            })}
          />
        )}
        {notes.length === NOTHING ? null : (
          <SuggestionChange
            icon={SUGGESTION_ICONS.notes}
            text={t(TRANSLATION_KEYS.suggestionChangeNotes, {
              values: notes.join(t(TRANSLATION_KEYS.suggestionSeparator)),
            })}
          />
        )}
      </View>

      <Text variant="caption" tone="onEspressoMuted">
        {t(TRANSLATION_KEYS.suggestionClosing)}
      </Text>

      <View style={styles.actions}>
        <SuggestionAnswer
          icon={SUGGESTION_ICONS.accept}
          label={t(TRANSLATION_KEYS.suggestionAccept)}
          disabled={busy}
          agrees
          onPress={(): void => {
            accept.mutate(suggestion.ref);
          }}
        />
        <SuggestionAnswer
          icon={SUGGESTION_ICONS.dismiss}
          label={t(TRANSLATION_KEYS.suggestionDismiss)}
          disabled={busy}
          onPress={(): void => {
            dismiss.mutate(suggestion.ref);
          }}
        />
      </View>

      {suggestion.explanationSource === INSIGHT_EXPLANATION_SOURCES.rules ? (
        <Text variant="captionSmall" tone="onEspressoMuted">
          {t(TRANSLATION_KEYS.suggestionWrittenByPhone)}
        </Text>
      ) : null}
    </View>
  );
};
