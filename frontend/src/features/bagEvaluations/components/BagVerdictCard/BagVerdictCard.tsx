import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ConfidenceNotice } from '../../../tasteProfile/components';
import type { BagVerdictUncertainty, BagVerdictView } from '../../services/bagVerdictView';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';
import { VerdictReasonList } from './VerdictReasonList';

const NOTHING = 0;

export interface BagVerdictCardProps {
  readonly verdict: BagVerdictView;
}

/**
 * The answer, and everything it rests on.
 *
 * The reasons start folded away and the verdict does not: in a shop the first
 * thing wanted is the sentence, and the argument is what somebody opens when
 * they want to disagree with it. Both are always there - a verdict that hid
 * what it did not see would be worth nothing.
 */
export const BagVerdictCard = ({ verdict }: BagVerdictCardProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.scanVerdictTitle)}
      </Text>
      {verdict.headline === null ? null : <Text variant="headlineSmall">{verdict.headline}</Text>}
      <Text variant="bodyMedium">{verdict.text}</Text>
      {verdict.isFromHistory ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.scanVerdictFromHistory)}
        </Text>
      ) : null}
      {verdict.isLocal ? (
        <Text variant="bodySmall" tone="tertiary">
          {t(TRANSLATION_KEYS.scanVerdictLocalNotice)}
        </Text>
      ) : null}
      <ConfidenceNotice />
      {verdict.reasons.length === NOTHING && verdict.uncertainties.length === NOTHING ? null : (
        <Button
          label={t(
            expanded ? TRANSLATION_KEYS.scanReasoningHide : TRANSLATION_KEYS.scanReasoningShow,
          )}
          variant="tertiary"
          onPress={(): void => {
            setExpanded(!expanded);
          }}
        />
      )}
      {expanded ? (
        <View style={styles.section}>
          <VerdictReasonList
            title={t(TRANSLATION_KEYS.scanReasoningTitle)}
            lines={verdict.reasons}
          />
          <VerdictReasonList
            title={t(TRANSLATION_KEYS.scanUncertaintyTitle)}
            lines={verdict.uncertainties.map((item: BagVerdictUncertainty): string => item.reason)}
            muted
          />
        </View>
      ) : null}
    </Card>
  );
};
