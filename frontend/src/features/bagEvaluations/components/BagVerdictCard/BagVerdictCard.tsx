import type { JSX } from 'react';
import { View } from 'react-native';

import { DriftingRings, Text } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';
import type { BagVerdictView } from '../../services/bagVerdictView';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';
import { VerdictProvenance } from './VerdictProvenance';
import { VerdictSubject } from './VerdictSubject';

export interface BagVerdictCardProps {
  readonly verdict: BagVerdictView;
  readonly coffeeName: string;
  readonly roaster: string;
}

/**
 * The answer.
 *
 * The one card this whole feature exists for, so the sentence is set at the
 * size of an answer rather than as body text under a label. Nothing here is
 * scored: no percentage, no stars, no bare yes or no. A number in front of a
 * shelf reads as a measurement of somebody's taste, and nobody has measured
 * that - so what is emphasised is the sentence, never a verdict level, and the
 * card is the same brown whatever it concludes.
 */
export const BagVerdictCard = ({
  verdict,
  coffeeName,
  roaster,
}: BagVerdictCardProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <DriftingRings
        size={theme.size.cardRingsSize}
        color={theme.colors.espressoLine}
        placement="bottomRight"
      />
      <VerdictSubject name={coffeeName} roaster={roaster} />
      <View style={styles.verdict}>
        {verdict.headline === null ? null : (
          <Text variant="displayAnswer" tone="onEspresso">
            {verdict.headline}
          </Text>
        )}
        <Text variant="bodyAnswer" tone="onEspresso">
          {verdict.text}
        </Text>
      </View>
      <VerdictProvenance verdict={verdict} />
    </View>
  );
};
