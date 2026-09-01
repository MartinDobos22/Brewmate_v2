import { MATCH_BANDS, type CoffeeMatch, type TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { TasteRadarChart } from '../../../tasteProfile/components';
import { MATCH_BAND_KEYS } from '../../constants/matchLabels';
import { readMatchReasons, type MatchReason } from '../../services/readMatchReasons';

import { createCoffeeMatchCardStyles } from './CoffeeMatchCard.styles';
import { MatchLegend } from './MatchLegend';

export interface CoffeeMatchCardProps {
  readonly match: CoffeeMatch;
  readonly profile: TasteProfile;
}

/**
 * The coffee drawn over the person, and what the difference between them means.
 *
 * The whole reason both are measured on the same five axes. Two charts side by
 * side would leave the comparison to be done by eye across a gap; one web with
 * two shapes on it makes the answer the picture rather than something the
 * reader has to work out.
 *
 * The card carries no colour that grades the coffee and no number anywhere. A
 * percentage in front of a shelf reads as a measurement of somebody's taste,
 * and nobody has measured that - the band is a sentence, and every reason
 * under it names an axis and a direction rather than a size.
 */
export const CoffeeMatchCard = ({ match, profile }: CoffeeMatchCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeMatchCardStyles);
  const { t } = useTranslation();
  const reasons = readMatchReasons(match);

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.matchTitle)}</Text>
      <Text variant="bodyLarge">{t(MATCH_BAND_KEYS[match.band])}</Text>
      {match.band === MATCH_BANDS.unknown ? null : (
        <>
          <TasteRadarChart
            axes={profile}
            axisConfidence={profile.axisConfidence}
            overlay={{ axes: match.coffeeAxes, axisConfidence: match.coffeeConfidence }}
          />
          <MatchLegend />
          <View style={styles.reasons}>
            {reasons.map((reason: MatchReason): JSX.Element => (
              <View key={reason.axis} style={styles.reason}>
                <Text variant="bodyMedium" tone={reason.isAgainst ? 'muted' : 'default'}>
                  {t(reason.labelKey)}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </Card>
  );
};
