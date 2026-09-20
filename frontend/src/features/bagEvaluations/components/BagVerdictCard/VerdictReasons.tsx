import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  VERDICT_GAP_ICONS,
  VERDICT_GROUP_ICONS,
  VERDICT_REASON_COLORS,
  VERDICT_REASON_ICONS,
  VERDICT_UNTYPED_ICON,
} from '../../constants';
import { BAG_SCAN_FIELDS, type BagScanField } from '../../constants/bagScan';
import type { BagVerdictReason, BagVerdictUncertainty } from '../../services/bagVerdictView';

import { VerdictReasonList, type VerdictLine } from './VerdictReasonList';
import { createVerdictReasonsStyles } from './VerdictReasons.styles';

const NOTHING = 0;

const isScanField = (field: string): field is BagScanField =>
  Object.values(BAG_SCAN_FIELDS).some((known: string): boolean => known === field);

export interface VerdictReasonsProps {
  readonly reasons: readonly BagVerdictReason[];
  readonly uncertainties: readonly BagVerdictUncertainty[];
}

/**
 * Why the app thinks what it thinks, and what it could not see.
 *
 * Two groups rather than one list, because they are two different claims: one
 * is an argument and the other is an admission. Each line carries the mark of
 * the fact it was argued from - a roast, a set of notes, a date, the taste
 * comparison - which classifies without grading. A line whose kind nothing
 * recorded gets a neutral bullet rather than a guessed one.
 */
export const VerdictReasons = ({
  reasons,
  uncertainties,
}: VerdictReasonsProps): JSX.Element | null => {
  const styles = useThemedStyles(createVerdictReasonsStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  if (reasons.length === NOTHING && uncertainties.length === NOTHING) {
    return null;
  }

  const reasonLines = reasons.map((reason: BagVerdictReason): VerdictLine => ({
    text: reason.text,
    icon: reason.field === null ? VERDICT_UNTYPED_ICON : VERDICT_REASON_ICONS[reason.field],
    color:
      reason.field === null
        ? theme.colors.onSurfaceVariant
        : theme.colors[VERDICT_REASON_COLORS[reason.field]],
  }));

  const gapLines = uncertainties.map((gap: BagVerdictUncertainty): VerdictLine => ({
    text: gap.reason,
    icon: isScanField(gap.field) ? VERDICT_GAP_ICONS[gap.field] : VERDICT_UNTYPED_ICON,
    color: theme.colors.onSurfaceVariant,
  }));

  return (
    <View style={styles.card}>
      <VerdictReasonList
        title={t(TRANSLATION_KEYS.scanReasoningTitle)}
        icon={VERDICT_GROUP_ICONS.reasons}
        lines={reasonLines}
      />
      {reasonLines.length === NOTHING || gapLines.length === NOTHING ? null : (
        <View style={styles.divider} />
      )}
      <VerdictReasonList
        title={t(TRANSLATION_KEYS.scanUncertaintyTitle)}
        icon={VERDICT_GROUP_ICONS.gaps}
        lines={gapLines}
        muted
      />
    </View>
  );
};
