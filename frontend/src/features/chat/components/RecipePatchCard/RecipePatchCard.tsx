import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BrewParams, RecipePatch } from '@brewmate/shared';
import { Fragment, type JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { CHAT_PATCH_ICONS, PATCH_ROW_ICONS } from '../../constants';
import { describeRecipePatch, patchRewritesSteps } from '../../services/describeRecipePatch';
import type { RecipePatchRow } from '../../services/describeRecipePatch';

import { createRecipePatchCardStyles } from './RecipePatchCard.styles';
import { RecipePatchRowView } from './RecipePatchRowView';

export interface RecipePatchCardProps {
  readonly patch: RecipePatch;
  readonly current: BrewParams;
  readonly isApplied: boolean;
  readonly isApplying: boolean;
  readonly hasFailed: boolean;
  readonly onApply: () => void;
}

const FIRST = 0;
const NOTHING = 0;

/**
 * What would change, old value beside new one.
 *
 * The explanation sits above the table rather than under it. The reason is
 * what somebody decides on; the numbers are what they check afterwards.
 *
 * The pour schedule is the one row with no before and after. A schedule does
 * not fit on a card next to another schedule, and what decides whether to
 * accept it - what changes about the taste - is in the sentence above rather
 * than in any table.
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
  const theme = useTheme();
  const { t } = useTranslation();
  const rows = describeRecipePatch(patch, current);
  const rewritesSteps = patchRewritesSteps(patch);

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={CHAT_PATCH_ICONS.heading}
          size={theme.size.iconRow}
          color={theme.colors.primary}
        />
        <View style={styles.title}>
          <Text variant="cardTitle">{t(TRANSLATION_KEYS.recipePatchTitle)}</Text>
        </View>
      </View>
      {patch.rationale === null || patch.rationale === undefined ? null : (
        <Text variant="bodyMuted" tone="muted">
          {patch.rationale}
        </Text>
      )}
      <View style={styles.rows}>
        {rows.map((row: RecipePatchRow, index: number): JSX.Element => (
          <Fragment key={row.labelKey}>
            {index === FIRST ? null : <View style={styles.divider} />}
            <RecipePatchRowView row={row} />
          </Fragment>
        ))}
        {rewritesSteps ? (
          <>
            {rows.length === NOTHING ? null : <View style={styles.divider} />}
            <View style={styles.row}>
              <MaterialCommunityIcons
                name={PATCH_ROW_ICONS.steps}
                size={theme.size.iconRow}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.label}>
                <Text variant="eyebrow" tone="muted">
                  {t(TRANSLATION_KEYS.recipePatchSteps)}
                </Text>
              </View>
              <Text variant="bodyMuted">{t(TRANSLATION_KEYS.recipePatchStepsChanged)}</Text>
            </View>
          </>
        ) : null}
      </View>
      {hasFailed ? (
        <Text variant="bodyMuted" tone="error">
          {t(TRANSLATION_KEYS.recipePatchError)}
        </Text>
      ) : null}
      {isApplied ? (
        <Text variant="bodyMuted" tone="fresh">
          {t(TRANSLATION_KEYS.recipePatchApplied)}
        </Text>
      ) : (
        <PillButton
          tone="espresso"
          icon={CHAT_PATCH_ICONS.apply}
          label={t(
            isApplying ? TRANSLATION_KEYS.recipePatchApplying : TRANSLATION_KEYS.recipePatchApply,
          )}
          isPending={isApplying}
          onPress={onApply}
        />
      )}
    </View>
  );
};
