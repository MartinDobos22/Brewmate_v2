import { COFFEE_ESTIMATE_SOURCES, type CoffeeTasteEstimate } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { TasteRadarChart, TasteReading } from '../../../tasteProfile/components';
import { hasKnownAxis } from '../../../tasteProfile/services';

import { CoffeeTasteEvidence } from './CoffeeTasteEvidence';
import { createCoffeeTasteCardStyles } from './CoffeeTasteCard.styles';

export interface CoffeeTasteCardProps {
  readonly estimate: CoffeeTasteEstimate;
  readonly summary: string | null;
  readonly flavourNotes: readonly string[];
  readonly isRefining: boolean;
}

/**
 * What is in the bag, drawn as the same shape the drinker is.
 *
 * Deliberately the same component as the taste profile's own chart rather than
 * a chart of its own. The entire reason a coffee is described on these five
 * axes is so it can be held up against a person, and two pictures drawn
 * differently would make that comparison something the reader has to do in
 * their head - badly. One shape, one vocabulary, one scale.
 *
 * An estimate with nothing behind it draws nothing at all, exactly as the home
 * screen's profile tile refuses to: a bag that printed only a name produces
 * five middles, and five middles drawn neatly stop looking like an absence of
 * evidence and start looking like a considered opinion about a coffee nobody
 * has tasted.
 */
export const CoffeeTasteCard = ({
  estimate,
  summary,
  flavourNotes,
  isRefining,
}: CoffeeTasteCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeTasteCardStyles);
  const { t } = useTranslation();
  const known = hasKnownAxis(estimate.axisConfidence);

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.coffeeTasteTitle)}</Text>
      {known ? null : (
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.coffeeTasteUnknown)}
        </Text>
      )}
      {known ? (
        <>
          {summary === null ? null : <Text variant="bodyLarge">{summary}</Text>}
          <TasteRadarChart axes={estimate.axes} axisConfidence={estimate.axisConfidence} />
          <TasteReading axes={estimate.axes} axisConfidence={estimate.axisConfidence} />
          {flavourNotes.length === 0 ? null : (
            <View style={styles.notes}>
              {flavourNotes.map((note: string): JSX.Element => (
                /**
                 * Printed as they were written, the way a coffee's variety is:
                 * these are the flavours somebody will actually meet, in the
                 * model's own Slovak, and the vocabulary belongs to the world
                 * rather than to a translation file.
                 */
                <View key={note} style={styles.note}>
                  <Text variant="labelMedium" tone="secondary">
                    {note}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : null}
      <CoffeeTasteEvidence signals={estimate.signals} isRefining={isRefining} />
      {estimate.source === COFFEE_ESTIMATE_SOURCES.label && !isRefining ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.coffeeTasteFromLabelOnly)}
        </Text>
      ) : null}
    </Card>
  );
};
