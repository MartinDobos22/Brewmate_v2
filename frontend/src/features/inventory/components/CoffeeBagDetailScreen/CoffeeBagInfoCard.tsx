import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';
import { InfoRow } from './InfoRow';

const NOTES_SEPARATOR = ', ';
const NOTHING = 0;
const EMPTY = '';

export interface CoffeeBagInfoCardProps {
  readonly bag: CoffeeBag;
}

const isRecorded = (value: string | null): boolean => value !== null && value.trim() !== EMPTY;

/**
 * Everything known about one coffee, and nothing else.
 *
 * Only what is actually recorded is printed. A row of dashes where a farm
 * would be tells somebody nothing except that the app has a farm field, and a
 * bag whose label said nothing is a perfectly ordinary bag - which is why a
 * card with no rows in it says so in a sentence rather than appearing as an
 * empty frame.
 *
 * Reference data, so it sits below the state and the actions: this is what
 * somebody reads once when the bag arrives, not what they came back for.
 */
export const CoffeeBagInfoCard = ({ bag }: CoffeeBagInfoCardProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();

  const altitude = bag.altitude === null ? null : String(bag.altitude);
  const weight = bag.weightGrams === null ? null : formatGrams(bag.weightGrams);
  const notes = bag.tastingNotes.length === NOTHING ? null : bag.tastingNotes.join(NOTES_SEPARATOR);
  const hasAnything = [
    bag.roaster,
    bag.originCountry,
    bag.region,
    bag.farm,
    bag.variety,
    bag.process,
    bag.roastDate,
    altitude,
    weight,
    notes,
  ].some(isRecorded);

  if (!hasAnything) {
    return (
      <Card>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.bagDetailLabelEmpty)}
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.rows}>
        <InfoRow label={t(TRANSLATION_KEYS.scanRoasterLabel)} value={bag.roaster} />
        <InfoRow label={t(TRANSLATION_KEYS.scanOriginLabel)} value={bag.originCountry} />
        <InfoRow label={t(TRANSLATION_KEYS.scanRegionLabel)} value={bag.region} />
        <InfoRow label={t(TRANSLATION_KEYS.scanFarmLabel)} value={bag.farm} />
        <InfoRow label={t(TRANSLATION_KEYS.scanVarietyLabel)} value={bag.variety} />
        <InfoRow label={t(TRANSLATION_KEYS.scanProcessLabel)} value={bag.process} />
        <InfoRow label={t(TRANSLATION_KEYS.scanRoastDateLabel)} value={bag.roastDate} />
        <InfoRow label={t(TRANSLATION_KEYS.scanAltitudeLabel)} value={altitude} />
        <InfoRow label={t(TRANSLATION_KEYS.scanWeightLabel)} value={weight} />
        <InfoRow label={t(TRANSLATION_KEYS.scanNotesLabel)} value={notes} />
      </View>
    </Card>
  );
};
