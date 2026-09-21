import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

import { FigureRow, PillButton, Text } from '../../../../components/ui';
import { buildRecipeChatRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { TIMELINE_ICONS } from '../../constants';
import { ConstraintBadges } from '../ConstraintBadges';

import { createTimelineEntryStyles } from './TimelineEntryCard.styles';
import { TimelineCount } from './TimelineCount';

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
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const version = index + NEXT;
  const isLatest = version === total;
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
    <View style={styles.entry}>
      <View style={styles.rail}>
        <View style={[styles.node, isLatest && styles.nodeLatest]}>
          <Text variant="numericFoot" tone={isLatest ? 'onCream' : 'muted'} numeric>
            {String(version)}
          </Text>
        </View>
        {isLatest ? null : <View style={styles.line} />}
      </View>

      <View style={[styles.card, isLatest && styles.cardLatest]}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text variant="rowTitle">
              {t(TRANSLATION_KEYS.historyVersionLabel, { number: version })}
            </Text>
          </View>
          <View style={[styles.chip, isLatest && styles.chipLatest]}>
            {isLatest ? (
              <MaterialCommunityIcons
                name={TIMELINE_ICONS.latest}
                size={theme.size.iconTiny}
                color={theme.colors.onFreshContainer}
              />
            ) : null}
            <Text variant="eyebrow" tone={isLatest ? 'fresh' : 'muted'}>
              {t(
                isLatest
                  ? TRANSLATION_KEYS.historyVersionLatest
                  : TRANSLATION_KEYS.historyVersionFirst,
              )}
            </Text>
          </View>
        </View>

        <FigureRow
          ruled={false}
          figures={[
            {
              value: formatGrams(entry.recipe.params.doseGrams),
              label: t(TRANSLATION_KEYS.figureDose),
            },
            {
              value: formatGrams(entry.recipe.params.waterGrams),
              label: t(TRANSLATION_KEYS.figureWater),
            },
            {
              value: formatRatio(entry.recipe.params.ratio),
              label: t(TRANSLATION_KEYS.figureRatio),
              derived: true,
            },
          ]}
        />

        {note === undefined ? null : (
          <View style={styles.note}>
            <MaterialCommunityIcons
              name={TIMELINE_ICONS.quote}
              size={theme.size.iconRow}
              color={theme.colors.onSurfaceVariant}
            />
            <View style={styles.noteText}>
              <Text variant="bodyMuted" tone="muted">
                {note.content}
              </Text>
            </View>
          </View>
        )}

        {entry.hasConstrainedBrew && constrained !== undefined ? (
          <View style={styles.constrained}>
            <ConstraintBadges constraints={constrained.constraints} />
            <Text variant="captionSmall" tone="muted">
              {t(TRANSLATION_KEYS.historyConstrainedNote)}
            </Text>
          </View>
        ) : null}

        <View style={styles.counts}>
          <TimelineCount
            icon={TIMELINE_ICONS.brews}
            label={t(
              entry.brewCount === NOTHING
                ? TRANSLATION_KEYS.historyBrewCountNone
                : TRANSLATION_KEYS.historyBrewCount,
              { count: entry.brewCount },
            )}
          />
          <TimelineCount
            icon={TIMELINE_ICONS.notes}
            label={t(TRANSLATION_KEYS.historyMessageCount, { count: entry.messageCount })}
          />
        </View>

        <PillButton
          tone="surfaceLead"
          size="small"
          icon={TIMELINE_ICONS.chat}
          label={t(TRANSLATION_KEYS.historyOpenChat)}
          onPress={(): void => {
            router.push(buildRecipeChatRoute(entry.recipe.id));
          }}
        />
      </View>
    </View>
  );
};
