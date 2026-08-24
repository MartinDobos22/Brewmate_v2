import {
  CHAT_ROLES,
  hasAnyConstraint,
  type BrewLog,
  type RecipeChatMessage,
  type RecipeTimelineEntry,
} from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text, ValueDisplay } from '../../../../components/ui';
import { buildRecipeChatRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { ConstraintBadges } from '../ConstraintBadges';

import { createTimelineEntryStyles } from './TimelineEntryCard.styles';

const NOTHING = 0;
const NEXT = 1;

export interface TimelineEntryCardProps {
  readonly entry: RecipeTimelineEntry;
  readonly index: number;
  readonly total: number;
}

/** The last thing the person themselves said about this version. */
const lastUserNote = (messages: readonly RecipeChatMessage[]): RecipeChatMessage | undefined =>
  [...messages].reverse().find((message): boolean => message.role === CHAT_ROLES.user);

/**
 * One version of a recipe, with what happened to it.
 *
 * The numbers, then what was said, then what it was brewed with - in that
 * order because the question this screen answers is "what did changing that
 * do?", and an answer needs the change before its consequences.
 *
 * A cup brewed with something missing is marked rather than hidden. Those are
 * exactly the cups that came out differently, and a history that quietly
 * ranked a cabin morning beside a measured one would teach the reader the
 * wrong lesson about their own kitchen.
 */
export const TimelineEntryCard = ({ entry, index, total }: TimelineEntryCardProps): JSX.Element => {
  const styles = useThemedStyles(createTimelineEntryStyles);
  const { t } = useTranslation();
  const router = useRouter();

  const note = lastUserNote(entry.messages);
  /**
   * The first cup that was actually missing something, which is the one whose
   * badges are worth printing. Read from the cups rather than from the recipe:
   * what a recipe was written around and what was missing on the morning
   * somebody brewed it are different facts, and the second is the one that
   * explains a disappointing cup.
   */
  const constrained = entry.brews.find((brew: BrewLog): boolean =>
    hasAnyConstraint(brew.constraints),
  );

  return (
    <Card>
      <View style={styles.header}>
        <Text variant="titleSmall">
          {t(TRANSLATION_KEYS.historyVersionLabel, { number: index + NEXT })}
        </Text>
        <Text variant="labelSmall" tone="muted">
          {t(
            index + NEXT === total
              ? TRANSLATION_KEYS.historyVersionLatest
              : TRANSLATION_KEYS.historyVersionFirst,
          )}
        </Text>
      </View>

      <View style={styles.numbers}>
        <ValueDisplay
          value={formatGrams(entry.recipe.params.doseGrams)}
          label={t(TRANSLATION_KEYS.preBrewDoseLabel)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
          size="medium"
        />
        <ValueDisplay
          value={formatGrams(entry.recipe.params.waterGrams)}
          label={t(TRANSLATION_KEYS.preBrewWaterLabel)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
          size="medium"
        />
        <ValueDisplay
          value={formatRatio(entry.recipe.params.ratio)}
          label={t(TRANSLATION_KEYS.preBrewRatioLabel)}
          size="medium"
        />
      </View>

      {note === undefined ? null : (
        <View style={styles.note}>
          <Text variant="bodySmall" tone="muted">
            {note.content}
          </Text>
        </View>
      )}

      {entry.hasConstrainedBrew && constrained !== undefined ? (
        <View style={styles.body}>
          <ConstraintBadges constraints={constrained.constraints} />
          <Text variant="labelSmall" tone="muted">
            {t(TRANSLATION_KEYS.historyConstrainedNote)}
          </Text>
        </View>
      ) : null}

      <View style={styles.counts}>
        <Text variant="labelSmall" tone="muted">
          {t(
            entry.brewCount === NOTHING
              ? TRANSLATION_KEYS.historyBrewCountNone
              : TRANSLATION_KEYS.historyBrewCount,
            { count: entry.brewCount },
          )}
        </Text>
        <Text variant="labelSmall" tone="muted">
          {t(TRANSLATION_KEYS.historyMessageCount, { count: entry.messageCount })}
        </Text>
      </View>

      <Button
        label={t(TRANSLATION_KEYS.historyOpenChat)}
        variant="tertiary"
        onPress={(): void => {
          router.push(buildRecipeChatRoute(entry.recipe.id));
        }}
      />
    </Card>
  );
};
