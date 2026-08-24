import type { BrewParams, RecipePatch } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { describeRecipePatch, patchRewritesSteps } from '../../services/describeRecipePatch';
import type { RecipePatchRow } from '../../services/describeRecipePatch';

import { createRecipePatchCardStyles } from './RecipePatchCard.styles';

export interface RecipePatchCardProps {
  readonly patch: RecipePatch;
  readonly current: BrewParams;
  readonly isApplied: boolean;
  readonly isApplying: boolean;
  readonly hasFailed: boolean;
  readonly onApply: () => void;
}

/**
 * What would change, old value beside new one.
 *
 * A diff rather than a new recipe card, because the question in front of
 * somebody is not "is this a good recipe" - they have already agreed it might
 * be - it is "what exactly are you changing". Two columns answer that in a
 * glance; a second full recipe would make them compare two cards line by line.
 *
 * The explanation sits above the table rather than under it. The reason is
 * what somebody decides on; the numbers are what they check afterwards.
 */
export const RecipePatchCard = ({
  patch,
  current,
  isApplied,
  isApplying,
  hasFailed,
  onApply,
}: RecipePatchCardProps): JSX.Element => {
  const styles = useThemedStyles(createRecipePatchCardStyles);
  const { t } = useTranslation();
  const rows = describeRecipePatch(patch, current);

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.recipePatchTitle)}</Text>
      {patch.rationale === null || patch.rationale === undefined ? null : (
        <Text variant="bodySmall" tone="muted">
          {patch.rationale}
        </Text>
      )}
      <View style={styles.rows}>
        {rows.map((row: RecipePatchRow): JSX.Element => (
          <View key={row.labelKey} style={styles.row}>
            <Text variant="labelMedium" tone="muted">
              {t(row.labelKey)}
            </Text>
            <View style={styles.values}>
              <Text variant="bodyMedium" tone="muted" numeric>
                {row.before}
              </Text>
              <Text variant="bodyMedium" tone="muted">
                {t(TRANSLATION_KEYS.recipePatchArrow)}
              </Text>
              <Text variant="bodyMedium" numeric>
                {row.after}
              </Text>
            </View>
          </View>
        ))}
        {patchRewritesSteps(patch) ? (
          <View style={styles.row}>
            <Text variant="labelMedium" tone="muted">
              {t(TRANSLATION_KEYS.recipePatchSteps)}
            </Text>
            <Text variant="bodyMedium">{t(TRANSLATION_KEYS.recipePatchStepsChanged)}</Text>
          </View>
        ) : null}
      </View>
      {hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.recipePatchError)}
        </Text>
      ) : null}
      {isApplied ? (
        <Text variant="bodySmall" tone="secondary">
          {t(TRANSLATION_KEYS.recipePatchApplied)}
        </Text>
      ) : (
        <Button
          label={t(
            isApplying ? TRANSLATION_KEYS.recipePatchApplying : TRANSLATION_KEYS.recipePatchApply,
          )}
          fullWidth
          loading={isApplying}
          onPress={onApply}
        />
      )}
    </Card>
  );
};
