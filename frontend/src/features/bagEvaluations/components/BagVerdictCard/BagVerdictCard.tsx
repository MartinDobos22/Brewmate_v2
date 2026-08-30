import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ConfidenceNotice } from '../../../tasteProfile/components';
import { SCAN_ICONS } from '../../constants';
import type { BagVerdictUncertainty, BagVerdictView } from '../../services/bagVerdictView';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';
import { VerdictProvenance } from './VerdictProvenance';
import { VerdictReasonList } from './VerdictReasonList';
import { VerdictSubject } from './VerdictSubject';

const NOTHING = 0;

export interface BagVerdictCardProps {
  readonly verdict: BagVerdictView;
  readonly coffeeName: string;
  readonly roaster: string;
}

/**
 * The answer, and everything it rests on.
 *
 * The one screen this whole feature exists for, so the sentence is set at the
 * size of an answer rather than as body text under a label. Nothing here is
 * scored: no percentage, no stars, no bare yes or no. A number in front of a
 * shelf reads as a measurement of somebody's taste, and nobody has measured
 * that - so what is emphasised is the sentence, never a verdict level, and the
 * card carries no colour that would grade the coffee.
 *
 * The reasons start folded away and the verdict does not: in a shop the first
 * thing wanted is the sentence, and the argument is what somebody opens when
 * they want to disagree with it. Both are always there - a verdict that hid
 * what it did not see would be worth nothing.
 */
export const BagVerdictCard = ({
  verdict,
  coffeeName,
  roaster,
}: BagVerdictCardProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const hasArgument = verdict.reasons.length > NOTHING || verdict.uncertainties.length > NOTHING;

  return (
    <Card variant="containerHigh">
      <VerdictSubject name={coffeeName} roaster={roaster} />
      <View style={styles.verdict}>
        {verdict.headline === null ? null : <Text variant="titleLarge">{verdict.headline}</Text>}
        <Text variant="bodyLarge">{verdict.text}</Text>
      </View>
      <VerdictProvenance verdict={verdict} />
      <ConfidenceNotice />
      {hasArgument ? (
        <Button
          label={t(
            expanded ? TRANSLATION_KEYS.scanReasoningHide : TRANSLATION_KEYS.scanReasoningShow,
          )}
          variant="tertiary"
          fullWidth
          onPress={(): void => {
            setExpanded(!expanded);
          }}
        />
      ) : null}
      {expanded ? (
        <View style={styles.section}>
          <VerdictReasonList
            title={t(TRANSLATION_KEYS.scanReasoningTitle)}
            icon={SCAN_ICONS.reason}
            lines={verdict.reasons}
          />
          <VerdictReasonList
            title={t(TRANSLATION_KEYS.scanUncertaintyTitle)}
            icon={SCAN_ICONS.gap}
            lines={verdict.uncertainties.map((item: BagVerdictUncertainty): string => item.reason)}
            muted
          />
        </View>
      ) : null}
    </Card>
  );
};
